import { Client } from '@googlemaps/google-maps-services-js';
import { Inject, Injectable } from '@nestjs/common';

import { GOOGLE_MAPS_OPTIONS_PROVIDER_NAME, GoogleMapsModuleOptions } from '../google-maps.types';

@Injectable()
export class GoogleMapsService {
  private _client: Client;
  constructor(
    @Inject(GOOGLE_MAPS_OPTIONS_PROVIDER_NAME)
    private readonly options: GoogleMapsModuleOptions,
  ) {
    this._client = this.createClientFromOptions();
  }

  private createClientFromOptions() {
    return new Client({
      config: {
        params: {
          key: this.options.key,
        },
      },
    });
  }

  get client(): Client {
    return this._client;
  }

  get key(): string {
    return this.options.key;
  }

  async placeAutocomplete(input: string) {
    const res = await this.client.placeAutocomplete({
      params: { input, key: this.key },
    });

    return res.data.predictions.map((item) => ({
      description: item.description,
      placeId: item.place_id,
      mainText: item.structured_formatting.main_text,
      secondaryText: item.structured_formatting.secondary_text,
      mainTextMatchedSubstrings: item.structured_formatting.main_text_matched_substrings,
    }));
  }
}
