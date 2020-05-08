import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Plugins, CameraResultType, CameraSource} from '@capacitor/core';
import {ShoppingListItem} from "../../models/shopping-list-item";
import {ShoppingListItemService} from "../../services/shopping-list-item.service";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../environments/environment";

const {Camera, Filesystem} = Plugins;

@Component({
    selector: 'app-shopping-list-item-details',
    templateUrl: './shopping-list-item-details.page.html',
    styleUrls: ['./shopping-list-item-details.page.scss'],
})


export class ShoppingListItemDetailsPage implements OnInit {

    photo: SafeResourceUrl;
    listItem = new ShoppingListItem(0, '', '', '', 0);
    itemId: number;

    constructor(private sanitizer: DomSanitizer, private listItemService: ShoppingListItemService, private route: ActivatedRoute) {
    }

    async ngOnInit() {
        this.itemId = this.route.snapshot.params['id'];
        // this.listItem = await this.listItemService.getItemById(this.itemId);
        console.log(this.listItemService.getAppShoppingList());
        this.listItem = this.listItemService.getAppShoppingList().find(item => item.shoppingListItemId == this.itemId);
        console.log(this.listItem);
        // console.log('listItem: ', this.listItem);
        if (this.listItem.imagePath != null && this.listItem.imagePath != '') {
            this.photo = environment.imageBasePath + this.listItem.imagePath;
        }

    }

    async ionViewWillLeave() {
        await this.listItemService.updateListItem(this.listItem);
    }

    async takePicture() {
        const image = await Plugins.Camera.getPhoto({
            quality: 10,
            allowEditing: false,
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera
        })
        console.log('------------------------');
        console.log(image);
        console.log('------------------------');
        try {
            let result = await this.listItemService.uploadImage(this.listItem.shoppingListId, this.listItem.shoppingListItemId, image.path);
            this.listItem.imagePath = result.response;
            this.photo = environment.imageBasePath + result.response;
            console.log(result.response);

        } catch (error) {
            console.log(error);
        }
    }

    async deleteImage() {
        await this.listItemService.deleteImage(this.listItem);
        this.listItem.imagePath = null;
        this.photo = '';
    }
}
