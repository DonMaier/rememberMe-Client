import { Injectable } from '@angular/core';
import {ShoppingList} from "../models/shopping-list";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ShoppingListItem} from "../models/shopping-list-item";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListItemService {

  constructor(private httpClient: HttpClient, private transfer: FileTransfer) { }

  shoppingListItems = [];

  async getListItemsById(shoppingListId) : Promise<ShoppingListItem[]> {
    return this.httpClient.get<ShoppingListItem[]>(`${environment.serverUrl}shopping-list-items/${shoppingListId}`).toPromise();
  }

  async getItemById(itemId) : Promise<ShoppingListItem> {
    return this.httpClient.get<ShoppingListItem>(`${environment.serverUrl}shopping-list-items/item/${itemId}`).toPromise();
  }

  saveListItem(listItem: ShoppingListItem) {
    return this.httpClient.post(`${environment.serverUrl}shopping-list-items`, listItem, {observe: 'response'}).toPromise();
  }

  updateListItem(listItem: ShoppingListItem) {
    return this.httpClient.post(`${environment.serverUrl}shopping-list-items/update`, listItem, {observe: 'response'}).toPromise();
  }

  deleteItemById(itemId: number) {
    return this.httpClient.post(`${environment.serverUrl}shopping-list-items/delete/${itemId}`, {observe: 'response'}).toPromise();
  }

    uploadImage(listId: number, itemId: number, filepath: string) {
    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'list-' + listId + '_item-' + itemId + '_' + new Date().getTime() + '.jpg'
    }

    try {
      return  fileTransfer.upload(filepath, `${environment.serverUrl}shopping-list-items/upload-image/${itemId}`, options)
    }
    catch (error) {
      console.log(error);
    }

  }

  deleteImage(item: ShoppingListItem) {
    console.log(item);
    return this.httpClient.post(`${environment.serverUrl}shopping-list-items/delete-image/${item.shoppingListItemId}`, item, {observe: 'response'}).toPromise();
  }

  getAppShoppingList() {
    return this.shoppingListItems;
  }
  setAppShoppingList(shoppingListItems: ShoppingListItem[]) {
    console.log('set set set');
    this.shoppingListItems = shoppingListItems;
    // console.log(this.shoppingListItems);
  }

}
