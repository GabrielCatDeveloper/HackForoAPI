

const LoginCookie='token';


export async function SetToken(data:any,res:any){

    let options:any= {
            sameSite:'None',
            httpOnly:true,
            maxAge:1000*60*60*24*100,
            secure:true
    };
    const exp="2400h";
    let token='';
    res.cookie(LoginCookie, token, options);
}

export function ClearToken(res:any){
    let options:any={httpOnly:true,secure:true};

    res.clearCookie(LoginCookie,options);
}

export function GetToken(req:any):string|undefined{
    return req.cookies[LoginCookie];
}