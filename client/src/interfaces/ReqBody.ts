export interface ReqBodyLogin {
    username: string;
    password: string;
}

export interface ReqBodyRegister {
    fullName: string;
    email: string;
    password: string;
}

export interface ReqBodyUpgrade {
    cc_number: string;
    exp_year: number;
    exp_month: number;
    cvc: string;
    plan: string;
}

export interface ReqBodyGeneralPrompt {
    prompt: string;
}

export interface ReqBodyFormDefinition {
    formDescription: string;
}

export interface ReqBodyFunctionGenerate {
    language: string;
    responseFormat: string;
    args: string;
    fnDescription: string;
    fnShouldReturn: string;
    fnTestShould: string;
}

export interface ReqBodyFunctionGenerate {
    language: string;
    responseFormat: string;
    args: string;
    fnDescription: string;
    fnShouldReturn: string;
    fnTestShould: string;
}

export interface ReqBodySoftwareEngineer {
    temp: number;
    language: string;
    input: string;
    instruct: string;
}

export interface ReqBodyRemoveToken {
    key: string;
}

export interface ReqBodyCreateToken {
    key: string;
    value: string;
}