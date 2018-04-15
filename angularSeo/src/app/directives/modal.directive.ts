import {
  Directive,
  ViewContainerRef,
  HostListener,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ComponentRef,
  ComponentFactoryResolver,
  AfterViewChecked,
  ElementRef
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ModalComponent } from "../components/modal/modal.component";

@Directive({
  selector: "[ng-modal]"
})
export class ModalDirective implements OnInit {
  // @Input('ng-modal') loginForm:FormGroup;
  @Input("ng-modal") mentor: any;
  @Input("isFlag") flag: boolean;
  @Output("ng-modalSubmit") public selected = new EventEmitter();
  private isVisible: boolean = false;
  public formComp: ComponentRef<ModalComponent>;

  @HostListener("click", ["$event"])
  onClick(event: any) {
    this.isVisible = true;
    this.showForm();
  }

  constructor(
    private el: ElementRef,
    private cpr: ComponentFactoryResolver,
    private vContainerRef: ViewContainerRef,
    private fb: FormBuilder
  ) {}

  ngOnInit() {}

  private showForm() {
    if (!this.formComp) {
      let componentFactory = this.cpr.resolveComponentFactory(ModalComponent);
      this.vContainerRef.clear();
      this.formComp = this.vContainerRef.createComponent(componentFactory);
      this.formComp.instance.mentor = this.mentor;
      this.formComp.instance.isRate = this.flag;

      this.updateForm();
      this.formComp.instance.selected.subscribe(selectedMentor => {
        this.selected.emit(selectedMentor);
      });
    } else {
      this.updateForm();
    }
  }
  updateForm() {
    this.formComp.instance.visible = true;
  }
}
