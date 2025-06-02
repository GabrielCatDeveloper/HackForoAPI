import { BaseController } from "../Controllers/base";
import { BaseMiddlewares } from "../Middlewares/base";
import { UserMiddlewares } from "../Middlewares/user";
import Campaign from "../Models/campaign";
import Message from "../Models/message";
import Reply from "../Models/reply";
import ReplyView from "../Models/replyView";
import Topic from "../Models/topic";
import User from "../Models/user";
import { BaseRouter } from "./base";
import {LoginRouter} from "./login";




export default [
    new LoginRouter(),
    new BaseRouter('user',new UserMiddlewares(),new BaseController(User)),
    new BaseRouter('topic',new BaseMiddlewares(Topic),new BaseController(Topic)),
    new BaseRouter('replyView',new BaseMiddlewares(ReplyView),new BaseController(ReplyView)),
    new BaseRouter('reply',new BaseMiddlewares(Reply),new BaseController(Reply)),
    new BaseRouter('message',new BaseMiddlewares(Message),new BaseController(Message)),
    new BaseRouter('campaign',new BaseMiddlewares(Campaign),new BaseController(Campaign)),
];