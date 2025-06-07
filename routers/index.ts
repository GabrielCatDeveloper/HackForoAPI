import { BaseController } from "../controllers/base";
import { BaseMiddlewares } from "../middlewares/base";
import { UserMiddlewares } from "../middlewares/user";
import Campaign from "../models/campaign";
import Message from "../models/message";
import Reply from "../models/reply";
import ReplyView from "../models/replyView";
import Topic from "../models/topic";
import User from "../models/user";
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