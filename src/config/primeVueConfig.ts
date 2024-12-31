import {App} from "vue";
import Tooltip from "primevue/tooltip";
import BadgeDirective from "primevue/badgedirective";
import Ripple from "primevue/ripple";
import StyleClass from "primevue/styleclass";
import FocusTrap from "primevue/focustrap";
import Accordion from "primevue/accordion";
import AutoComplete from "primevue/autocomplete";
import Avatar from "primevue/avatar";
import AvatarGroup from "primevue/avatargroup";
import Badge from "primevue/badge";
import BlockUI from "primevue/blockui";
import Breadcrumb from "primevue/breadcrumb";
import Button from "primevue/button";
import Card from "primevue/card";
import Carousel from "primevue/carousel";
import CascadeSelect from "primevue/cascadeselect";
import Checkbox from "primevue/checkbox";
import Chip from "primevue/chip";
import InputChips from "primevue/inputchips";
import ColorPicker from "primevue/colorpicker";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import ConfirmDialog from "primevue/confirmdialog";
import ConfirmPopup from "primevue/confirmpopup";
import ContextMenu from "primevue/contextmenu";
import DataTable from "primevue/datatable";
import DataView from "primevue/dataview";
import DeferredContent from "primevue/deferredcontent";
import Dialog from "primevue/dialog";
import Divider from "primevue/divider";
import Dock from "primevue/dock";
import DynamicDialog from "primevue/dynamicdialog";
import FloatLabel from 'primevue/floatlabel';
import Fieldset from "primevue/fieldset";
import FileUpload from "primevue/fileupload";
import Galleria from "primevue/galleria";
import IftaLabel from 'primevue/iftalabel';
import Image from "primevue/image";
import Inplace from "primevue/inplace";
import InputMask from "primevue/inputmask";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import Knob from "primevue/knob";
import Listbox from "primevue/listbox";
import MegaMenu from "primevue/megamenu";
import Menu from "primevue/menu";
import Menubar from "primevue/menubar";
import Message from "primevue/message";
import MeterGroup from "primevue/metergroup";
import MultiSelect from "primevue/multiselect";
import OrderList from "primevue/orderlist";
import OrganizationChart from "primevue/organizationchart";
import Paginator from "primevue/paginator";
import Panel from "primevue/panel";
import PanelMenu from "primevue/panelmenu";
import Password from "primevue/password";
import PickList from "primevue/picklist";
import ProgressBar from "primevue/progressbar";
import ProgressSpinner from "primevue/progressspinner";
import RadioButton from "primevue/radiobutton";
import Rating from "primevue/rating";
import Row from "primevue/row";
import SelectButton from "primevue/selectbutton";
import ScrollPanel from "primevue/scrollpanel";
import ScrollTop from "primevue/scrolltop";
import Slider from "primevue/slider";
import Skeleton from "primevue/skeleton";
import SpeedDial from "primevue/speeddial";
import SplitButton from "primevue/splitbutton";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import Steps from "primevue/steps";
import TabMenu from "primevue/tabmenu";
import TabPanel from "primevue/tabpanel";
import Tag from "primevue/tag";
import Textarea from "primevue/textarea";
import Terminal from "primevue/terminal";
import TieredMenu from "primevue/tieredmenu";
import Timeline from "primevue/timeline";
import Toast from "primevue/toast";
import Toolbar from "primevue/toolbar";
import ToggleButton from "primevue/togglebutton";
import Tree from "primevue/tree";
import TreeSelect from "primevue/treeselect";
import TreeTable from "primevue/treetable";
import VirtualScroller from "primevue/virtualscroller";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import Select from "primevue/select";
import ToggleSwitch from "primevue/toggleswitch";
import DatePicker from "primevue/datepicker";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";
import DialogService from "primevue/dialogservice";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Popover from "primevue/popover";
import PrimeVue from "primevue/config";
import Aura from '@primevue/themes/aura';


import {MyPreset} from '@/config/primeVueStyleThemeConfig';

export const registerPrimeVue = (app: App) => {
    app.use(PrimeVue, {
        ripple: true,
        theme: {preset: MyPreset}
    } as any);
    app.directive('tooltip', Tooltip);
    app.directive('badge', BadgeDirective);
    app.directive('ripple', Ripple);
    app.directive('styleclass', StyleClass);
    app.directive('focustrap', FocusTrap);
    app.component('Accordion', Accordion);
    app.component('AutoComplete', AutoComplete);
    app.component('Avatar', Avatar);
    app.component('AvatarGroup', AvatarGroup);
    app.component('Badge', Badge);
    app.component('BlockUI', BlockUI);
    app.component('Breadcrumb', Breadcrumb);
    app.component('Button', Button);
    app.component('Card', Card);
    app.component('Carousel', Carousel);
    app.component('CascadeSelect', CascadeSelect);
    app.component('Checkbox', Checkbox);
    app.component('Chip', Chip);
    app.component('ColorPicker', ColorPicker);
    app.component('Column', Column);
    app.component('ColumnGroup', ColumnGroup);
    app.component('ConfirmDialog', ConfirmDialog);
    app.component('ConfirmPopup', ConfirmPopup);
    app.component('ContextMenu', ContextMenu);
    app.component('DataTable', DataTable);
    app.component('DataView', DataView);
    app.component('DeferredContent', DeferredContent);
    app.component('Dialog', Dialog);
    app.component('Divider', Divider);
    app.component('Dock', Dock);
    app.component('DynamicDialog', DynamicDialog);
    app.component('FloatLabel', FloatLabel);
    app.component('Fieldset', Fieldset);
    app.component('FileUpload', FileUpload);
    app.component('Galleria', Galleria);
    app.component('IftaLabel', IftaLabel);
    app.component('InputChips', InputChips);
    app.component('Image', Image);
    app.component('Inplace', Inplace);
    app.component('InputMask', InputMask);
    app.component('InputNumber', InputNumber);
    app.component('InputText', InputText);
    app.component('Knob', Knob);
    app.component('Listbox', Listbox);
    app.component('MegaMenu', MegaMenu);
    app.component('Menu', Menu);
    app.component('Menubar', Menubar);
    app.component('Message', Message);
    app.component('MeterGroup', MeterGroup);
    app.component('MultiSelect', MultiSelect);
    app.component('OrderList', OrderList);
    app.component('OrganizationChart', OrganizationChart);
    app.component('Paginator', Paginator);
    app.component('Panel', Panel);
    app.component('PanelMenu', PanelMenu);
    app.component('Password', Password);
    app.component('PickList', PickList);
    app.component('ProgressBar', ProgressBar);
    app.component('ProgressSpinner', ProgressSpinner);
    app.component('RadioButton', RadioButton);
    app.component('Rating', Rating);
    app.component('Row', Row);
    app.component('SelectButton', SelectButton);
    app.component('ScrollPanel', ScrollPanel);
    app.component('ScrollTop', ScrollTop);
    app.component('Slider', Slider);
    app.component('Skeleton', Skeleton);
    app.component('SpeedDial', SpeedDial);
    app.component('SplitButton', SplitButton);
    app.component('Splitter', Splitter);
    app.component('SplitterPanel', SplitterPanel);
    app.component('Steps', Steps);
    app.component('TabMenu', TabMenu);
    app.component('TabPanel', TabPanel);
    app.component('Tag', Tag);
    app.component('Textarea', Textarea);
    app.component('Terminal', Terminal);
    app.component('TieredMenu', TieredMenu);
    app.component('Timeline', Timeline);
    app.component('Toast', Toast);
    app.component('Toolbar', Toolbar);
    app.component('ToggleButton', ToggleButton);
    app.component('Tree', Tree);
    app.component('TreeSelect', TreeSelect);
    app.component('TreeTable', TreeTable);
    app.component('VirtualScroller', VirtualScroller);
    app.component('InputGroup', InputGroup);
    app.component('InputGroupAddon', InputGroupAddon);
    app.component('Select', Select);
    app.component('ToggleSwitch', ToggleSwitch);
    app.component('DatePicker', DatePicker);
    app.component('IconField', IconField);
    app.component('InputIcon', InputIcon);
    app.component('Popover', Popover);
    app.use(ConfirmationService);
    app.use(ToastService);
    app.use(DialogService);
}