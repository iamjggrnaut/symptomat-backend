import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CloudFilesStorageService } from '@purrweb/cloud-files-storage';
import { PatientAnalyzesCreatedEvent } from 'src/common/events';
import { PATIENT_ANALYZES_CREATED_EVENT } from 'src/common/events/events.types';
import { SearchOrder } from 'src/common/types/users.types';
import { DoctorsPatientsRepository } from 'src/doctors/repositories';
import { cursorToData, dataToCursor } from 'src/utils/base64';
import * as uuid from 'uuid';

import { PatientAnalyzes } from '../entities/patient-analyzes.entity';
import { CreateAnalyzesInput } from '../inputs/patient-create-analyzes.input';
import { PatientAnalyzeModel } from '../model/patient-anylize.model';
import { PatientAnalyzesRepository } from '../repositories/patient-analyzes.repository';

interface PatientAnalyzeCursor {
  last: Pick<PatientAnalyzes, 'createdAt' | 'id'>;
  patientId: string;
  orderBy: SearchOrder;
  take: number;
  startAt?: Date;
  endAt?: Date;
}
@Injectable()
export class PatientAnalyzesService {
  constructor(
    private readonly cloudFilesStorageService: CloudFilesStorageService,
    private readonly patientAnalyzeRepository: PatientAnalyzesRepository,
    private readonly doctorsPatientsRepository: DoctorsPatientsRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async createSignedUrl(filename: string) {
    const fileKey = `${uuid.v4()}/${filename}`;
    const signedUrl = await this.cloudFilesStorageService.getSignedUrl('public', 'putObject', {
      fileKey,
    });

    return {
      fileKey,
      signedUrl,
    };
  }

  async getSignedUrl(fileKey: string) {
    const signedUrl = await this.cloudFilesStorageService.getSignedUrl('public', 'getObject', {
      fileKey,
    });
    return signedUrl;
  }

  async createPatientAnalyze(input: CreateAnalyzesInput, patientId: string) {
    const doctorId = input.doctorId;
    const doctorPatient = await this.doctorsPatientsRepository.findOne({
      where: {
        patientId,
        doctorId,
      },
    });

    if (!doctorPatient) {
      throw new BadRequestException("It's not your doctor!");
    }
    const patientAnalyzes = input.files.map((file) => {
      return {
        filename: file.fileName,
        fileKey: file.fileKey,
        patientId: patientId,
        doctorId: doctorId,
      };
    });
    try {
      const savedPatientAnalyzes = await this.patientAnalyzeRepository.save(patientAnalyzes);
      this.eventEmitter.emit(PATIENT_ANALYZES_CREATED_EVENT, new PatientAnalyzesCreatedEvent({ patientId, doctorId }));
      return savedPatientAnalyzes;
    } catch {
      throw new NotFoundException('patient not found');
    }
  }

  async searchPatientAnalyzes({
    doctorId,
    patientId,
    orderBy = SearchOrder.DESC,
    first = 4,
    after,
    startAt,
    endAt,
  }: {
    doctorId: string;
    patientId: string;
    orderBy: SearchOrder;
    first: number;
    after?: string;
    startAt?: Date;
    endAt?: Date;
  }) {
    const doctorPatient = await this.doctorsPatientsRepository.findOne({
      doctorId,
      patientId,
    });
    if (!doctorPatient) {
      throw new ForbiddenException('this is not your patient');
    }
    if (first < 0) {
      throw new Error('Argument `first` must be non-negative number.');
    }
    if (first > 20) {
      throw new Error('Argument `first` must be less than or equal 20.');
    }
    const cursor: PatientAnalyzeCursor | null = after != null ? cursorToData<PatientAnalyzeCursor>(after) : null;
    const currentPatientId = cursor ? cursor.patientId : patientId;
    const currentStartAt = cursor ? cursor.startAt : startAt;
    const currentEndAt = cursor ? cursor.endAt : endAt;
    const currentOrderBy = cursor ? cursor.orderBy : orderBy;
    const currentTake = cursor ? cursor.take : first + 1;

    const pa = await this.patientAnalyzeRepository.findManyByCriteria({
      orderBy: currentOrderBy,
      startAt: currentStartAt,
      endAt: currentEndAt,
      take: currentTake,
      patientId: currentPatientId,
      last: cursor?.last,
    });

    let newCursor: PatientAnalyzeCursor;
    if (pa.length > 2) {
      newCursor = {
        orderBy: currentOrderBy,
        startAt: currentStartAt,
        endAt: currentEndAt,
        take: currentTake,
        patientId: currentPatientId,
        last: {
          id: pa[pa.length - 2].id,
          createdAt: pa[pa.length - 2].createdAt,
        },
      };
    }

    const hasNextPage = pa.length > currentTake - 1;
    return {
      nodes: hasNextPage
        ? pa.slice(0, -1).map((pa) => PatientAnalyzeModel.create(pa))
        : pa.map((pa) => PatientAnalyzeModel.create(pa)),
      pageInfo: {
        hasNextPage,
        endCursor: hasNextPage && newCursor ? dataToCursor<PatientAnalyzeCursor>(newCursor) : null,
      },
    };
  }

  async getNewPatientAnalyzesCount(doctorId: string, patientId: string) {
    const newAnalyzesCount = await this.patientAnalyzeRepository.count({
      where: {
        doctorId,
        patientId,
        isViewed: false,
      },
    });
    return newAnalyzesCount;
  }

  async markPatientAnalyzesAsViewed(doctorId: string, patientId: string) {
    const newAnalyzesCount = await this.getNewPatientAnalyzesCount(doctorId, patientId);
    if (newAnalyzesCount === 0) {
      throw new BadRequestException(`No unviewed analyzes`);
    }
    await this.patientAnalyzeRepository.update({ isViewed: false }, { isViewed: true });
    return true;
  }
}
