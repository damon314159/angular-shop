import { bootstrapApplication } from '@angular/platform-browser'
import { appConfig } from './app/app.config'
import { AppComponent } from './app/app.component'

// Bootstrap entire application with simple error logging
bootstrapApplication(AppComponent, appConfig).catch((err) => {
  console.error(err)
})
