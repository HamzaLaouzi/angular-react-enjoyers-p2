import { 
  ApplicationConfig, 
  importProvidersFrom, 
  provideBrowserGlobalErrorListeners, 
  provideZoneChangeDetection 
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { ToastrModule } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp({
      projectId: "equipo-basket",
      appId: "1:51765152514:web:6e25113e8bacca8103501b",
      storageBucket: "equipo-basket.firebasestorage.app",
      apiKey: "AIzaSyDEeYKxOUt8e7i64luTI1Z2EwdxnaWgVAY",
      authDomain: "equipo-basket.firebaseapp.com",
      messagingSenderId: "51765152514"
    })),
    provideFirestore(() => getFirestore()),
    // Añadimos Toastr
    provideAnimations(),
    importProvidersFrom(
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-bottom-right',
        preventDuplicates: true,
      })
    ),
  ]
};
