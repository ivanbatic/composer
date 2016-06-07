import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class TreeViewService{

    public highlightedNode = new BehaviorSubject<any>(true);
    constructor(){
        console.log("New Tree View Service");
    }
}