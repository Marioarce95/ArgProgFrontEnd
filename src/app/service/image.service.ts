import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject, ListResult } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private storage = getStorage(initializeApp(environment.firebase));

  public uploadImage(file: File, name: string): Observable<number> {
    const path = `imagen/${name}`;
    const storageRef = ref(this.storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);
    return new Observable<number>((observer) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          observer.next(progress);
        },
        (error) => {
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      );
    });
  }

  public getImageUrl(name: string): Observable<string> {
    const path = `imagen/${name}`;
    const storageRef = ref(this.storage, path);
    return new Observable<string>((observer) => {
      getDownloadURL(storageRef)
        .then((url) => {
          observer.next(url);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  public deleteImage(name: string): Observable<void> {
    const path = `imagen/${name}`;
    const storageRef = ref(this.storage, path);
    return new Observable<void>((observer) => {
      deleteObject(storageRef)
        .then(() => {
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  public getImages(): Observable<string[]> {
    const path = 'imagen';
    const storageRef = ref(this.storage, path);
    return new Observable<string[]>((observer) => {
      listAll(storageRef)
        .then((result: ListResult) => {
          const filePaths = result.items.map((item) => item.fullPath);
          observer.next(filePaths);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
