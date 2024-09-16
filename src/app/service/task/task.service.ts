import { Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { AuthService } from "../auth/auth.service";
import { Observable } from "rxjs";
import { Task } from "../../model/task.interface";

@Injectable({
    providedIn: 'root'
  })

  export class TaskService {
    constructor(
        private apiService: ApiService,
        private authService: AuthService
      ) { }



  }
  