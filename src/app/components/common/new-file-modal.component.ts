import {Component, OnInit} from "@angular/core";
import {
    NgStyle,
    Control,
    ControlGroup,
    Validators,
    FORM_DIRECTIVES,
    FormBuilder
} from "@angular/common";
import {BlockLoaderComponent} from "../block-loader/block-loader.component";
import * as _ from "lodash";
import {Store} from "@ngrx/store";
import * as ACTIONS from "../../store/actions";
import {FileEffects} from "../../store/effects/file.effects";

@Component({
    selector: 'new-file-modal',
    directives: [NgStyle, BlockLoaderComponent, FORM_DIRECTIVES],
    templateUrl: 'app/components/common/new-file-modal.component.html'
})
export class NewFileModalComponent implements OnInit {
    isCreatingFile: boolean;
    showFileExists: boolean;
    isGeneralError: boolean;

    name: Control;
    fileType: Control;
    newFileForm: ControlGroup;

    confirm: Function;
    fileTypes: any[];

    selectedType: any;

    constructor(private formBuilder: FormBuilder, private store: Store, private fileFx: FileEffects) {
        this.fileTypes = [{
            id: '.json',
            name: 'JSON'
        }, {
            id: '.yaml',
            name: 'YAML'
        }, {
            id: '.js',
            name: 'JavaScript'
        }];

        this.fileFx.newFile$.subscribe(this.store);

        this.name     = new Control('',
            Validators.compose([Validators.required, Validators.minLength(1)])
        );
        this.fileType = new Control(this.fileTypes[0]);

        this.newFileForm = formBuilder.group({
            name: this.name,
            fileType: this.fileType
        });

        //@todo(maya) figure out if there is a better way to set a default value
        this.selectedType = this.fileTypes[0];

        this.name.valueChanges.subscribe(() => {
            this.showFileExists = false;
            this.isGeneralError = false;
        });
    }

    createFile(form) {
        // turn on loading
        this.isCreatingFile = true;
        let formValue       = form.value;

        let fileName = formValue.name;
        //noinspection TypeScriptUnresolvedVariable
        let ext      = formValue.fileType.id;

        // IF: file already has an extension
        if ('.' + _.last(fileName.split('.')) === ext) {
            // remove extension
            fileName = fileName.split('.').slice(0, -1).join('.');
        }

        let filePath = fileName + ext;

        // create file

        this.store.dispatch({type: ACTIONS.CREATE_FILE_REQUEST, payload: filePath});
        this.isCreatingFile = true;

        this.store.select("newFile").subscribe((file) => {
            if (file && file.path === filePath) {
                this.isCreatingFile = false;
                this.store.dispatch({type: ACTIONS.OPEN_FILE_REQUEST, payload: file.model});
                this.confirm(file.model);
            }
        });

        // Handle error if file already exists
        this.store.select("globalErrors").subscribe((error) => {
            if (error && error.path === filePath) {
                this.isCreatingFile = false;

                if (error.error.statusCode === 403) {
                    this.showFileExists = true;
                } else {
                    this.isGeneralError = true;
                }
            }
        });
    }

    public ngOnInit() {
    }
}
