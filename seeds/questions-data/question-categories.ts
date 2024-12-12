import { createQuestionCategory } from "./utils";

const centralNervousSystem = createQuestionCategory({
    name: 'Центральная нервная система',
  });

  const peripheralNervousSystem = createQuestionCategory({
    name: 'Периферическая нервная система',
  });

  const senseOrgans = createQuestionCategory({
    name: 'Органы чувств',
  });

  const skinMucous = createQuestionCategory({
    name: 'Кожа, слизистые',
  });

  const respiratorySystem = createQuestionCategory({
    name: 'Дыхательная система',
  });

  const cardiovascularSystem = createQuestionCategory({
    name: 'Сердечно-сосудистая система',
  });

  const digestiveSystem = createQuestionCategory({
    name: 'Пищеварительная система',
  });

  const urinarySystem = createQuestionCategory({
    name: 'Мочевыделительная система',
  });

  const femaleReproductiveSystem = createQuestionCategory({
    name: 'Женская репродуктивная система',
  });

  const maleReproductiveSystem = createQuestionCategory({
    name: 'Мужская репродуктивная система',
  });

  const endocrineGlands = createQuestionCategory({
    name: 'Эндокринные железы',
  });

  const lymphaticSystem = createQuestionCategory({
    name: 'Лимфатическая система',
  });

  const locomotorApparatus = createQuestionCategory({
    name: 'Опорно-двигательный аппарат',
  });

  const generalIndicators = createQuestionCategory({
    name: 'Общие показатели',
  });

  export const questionCategories = {
      centralNervousSystem,
      peripheralNervousSystem,
      senseOrgans,
      skinMucous,
      respiratorySystem,
      cardiovascularSystem,
      digestiveSystem,
      urinarySystem,
      femaleReproductiveSystem,
      maleReproductiveSystem,
      endocrineGlands,
      lymphaticSystem,
      locomotorApparatus,
      generalIndicators,
  }
  