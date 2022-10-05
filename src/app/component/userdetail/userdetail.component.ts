import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap} from "@angular/router";
import {UserService} from "../../service/user.service";
import {Response} from "../../interface/response.interface";
import * as Leaflet from 'leaflet';
import {User} from "../../interface/user.interface";
import {Coordinate} from "../../interface/coordinate.interface";

@Component({
  selector: 'app-userdetail',
  templateUrl: './userdetail.component.html',
  styleUrls: ['./userdetail.component.css']
})
export class UserdetailComponent implements OnInit {
  marker = Leaflet.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon.png',
    iconSize: [32, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
  });
  user: User;
  // response: Response;
  mode: 'edit' | 'locked' = 'locked';
  buttonText : 'Save Changes' | 'Edit' = 'Edit';
  constructor( private activatedRoute: ActivatedRoute,
               private  userService: UserService) { }

  ngOnInit(): void {
    this.user = (<User>(this.activatedRoute.snapshot.data['resolvedResponse'].results[0]));
    this.loadMap(this.user.coordinates);
    /*
    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap) => {
        this.userService.getUser(params.get('uuid')!).subscribe(
          (response: any) =>{
            console.log(response);
            this.response = response;
          })
      }
    )
    */
  }

  changeMode(mode?: 'edit' | 'locked'): void {
    this.mode = this.mode === 'locked' ? 'edit' : 'locked';
    this.buttonText = this.buttonText === 'Edit' ? 'Save Changes' : 'Edit';
    if (mode === 'edit'){
      // logic to update user on the backend
      console.log('update user on the backend');
    }
  }

  private loadMap(coordinate: Coordinate): void {
    const map = Leaflet.map('map', {
      center: [coordinate.latitude, coordinate.longitude],
      zoom: 8
    });
    const mainLayer = Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 1,
      maxZoom:30,
      crossOrigin: true,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    mainLayer.addTo(map);
    const marker = Leaflet.marker([coordinate.latitude, coordinate.longitude], { icon: this.marker });
    marker.addTo(map).bindPopup(`${this.user.firstName}'s Location`).openPopup();
  }
}
