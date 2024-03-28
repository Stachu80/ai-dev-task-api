import { Routes } from '@angular/router';
import {HelloApiComponent} from "./helloapi/hello-api.component";
import {ModerationComponent} from "./moderation/moderation.component";
import {BloggerComponent} from "./blogger/blogger.component";
import {LiarComponent} from "./liar/liar.component";
import {InpromptComponent} from "./inprompt/inprompt.component";
import {EmbeddingComponent} from "./embedding/embedding.component";
import {WhisperComponent} from "./whisper/whisper.component";
export const routes: Routes = [
  { path: 'helloApi', component: HelloApiComponent },
  { path: 'moderation', component: ModerationComponent },
  { path: 'blogger', component: BloggerComponent },
  { path: 'liar', component: LiarComponent },
  { path: 'inprompt', component: InpromptComponent },
  { path: 'embedding', component: EmbeddingComponent },
  { path: 'whisper', component: WhisperComponent },
];

