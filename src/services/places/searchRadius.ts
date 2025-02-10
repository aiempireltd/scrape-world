import { SEARCH_CONFIG } from '../../config/searchConfig';

export class SearchRadius {
  private currentRadiusIndex = 0;
  private readonly baseRadius: number;

  constructor(initialRadius: number = SEARCH_CONFIG.RADIUS.DEFAULT) {
    this.baseRadius = Math.min(initialRadius, SEARCH_CONFIG.RADIUS.MAX);
  }

  getCurrentRadius(): number {
    const multiplier = SEARCH_CONFIG.RADIUS.INCREMENTS[this.currentRadiusIndex];
    return Math.min(this.baseRadius * multiplier, SEARCH_CONFIG.RADIUS.MAX);
  }

  increment(): boolean {
    if (this.currentRadiusIndex < SEARCH_CONFIG.RADIUS.INCREMENTS.length - 1) {
      this.currentRadiusIndex++;
      return true;
    }
    return false;
  }

  reset(): void {
    this.currentRadiusIndex = 0;
  }

  hasNextRadius(): boolean {
    return this.currentRadiusIndex < SEARCH_CONFIG.RADIUS.INCREMENTS.length - 1;
  }
}