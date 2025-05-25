import { BaseController } from "../Controllers/base.ts";
import { BaseMiddlewares } from "../Middlewares/base.ts";
import { UserMiddlewares } from "../Middlewares/user.ts";
import Campaign from "../Models/campaign.ts";
import Message from "../Models/message.ts";
import Reply from "../Models/reply.ts";
import ReplyView from "../Models/replyView.ts";
import Topic from "../Models/topic.ts";
import User from "../Models/user.ts";
import { BaseRouter } from "./base.ts";
import {LoginRouter} from "./login.ts";




export default [
    new LoginRouter(),
    new BaseRouter('user',new UserMiddlewares(),new BaseController(User)),
    new BaseRouter('topic',new BaseMiddlewares(Topic),new BaseController(Topic)),
    new BaseRouter('replyView',new BaseMiddlewares(ReplyView),new BaseController(ReplyView)),
    new BaseRouter('reply',new BaseMiddlewares(Reply),new BaseController(Reply)),
    new BaseRouter('message',new BaseMiddlewares(Message),new BaseController(Message)),
    new BaseRouter('campaign',new BaseMiddlewares(Campaign),new BaseController(Campaign)),
];