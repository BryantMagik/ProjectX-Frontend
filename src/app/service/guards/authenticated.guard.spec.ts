import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { AuthenticatedGuard } from './authenticated.guard';

describe('authenticatedGuard', () => {
    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => AuthenticatedGuard(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(executeGuard).toBeTruthy();
    });
});