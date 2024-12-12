import DataLoader from 'dataloader';

export interface DataLoaderInterface<ID, Type> {
  /**
   * Should return a new instance of dataloader each time
   */
  generateDataLoader(): DataLoader<ID, Type>;
}
