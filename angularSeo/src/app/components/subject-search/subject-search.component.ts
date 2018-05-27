import { Component, OnInit,Output,EventEmitter, Input, ViewChild, ElementRef,OnChanges,SimpleChanges} from "@angular/core";
import { Observable } from "rxjs";
import { DataService } from "../../services/data.service";
import {FormControl} from "@angular/forms";
import {debounceTime,map} from "rxjs/operators"


@Component({
  selector: "subject-search",
  templateUrl: "./subject-search.component.html",
  styleUrls: ["./subject-search.component.css"]
})
export class SubjectSearchComponent implements OnInit {
  subjectArray: any[] = [];


  subjectControl = new FormControl();
  @Output()subjectEvent=new EventEmitter<any>();
  @Input() subject:string;
  @ViewChild('#subRef')subRef:ElementRef
  

  constructor(private data: DataService) {}
  formatter = (result: any) => result.name;

  searchSub = (text$: Observable<string>) =>
    text$
      .pipe(debounceTime(200)
      ,map(
        term =>
          term === ""
            ? []
            : this.subjectArray
                .filter(
                  v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1
                )
                .slice(0, 10)
      ));

  ngOnInit() {
    this.data.currentSubArray.subscribe(sub=>{
      if(!Array.isArray(sub) || !sub.length){return;}
      this.subjectArray = sub.slice(0,sub.length);
    })
    if(!Array.isArray(this.subjectArray) || !this.subjectArray.length){
      this.data.getAllSubjects().subscribe(data => {
        this.subjectArray = data["subjects"].slice(0, data["subjects"].length);
        this.data.inputSubjectValues(this.subjectArray);
      });
    }
    

  }

  ngOnChanges(change:SimpleChanges){
    
    if(change['subject']){
      this.subjectControl.setValue(this.subject);
    }
  }

  Selected(item:any){
    const sub = item.item
    this.subjectEvent.emit(sub);

  }

}
