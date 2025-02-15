// eslint-disable-next-line node/no-missing-import
import type { Req, Res, ServerMethods, ServerRequestApi } from 'server-pattern-matcher/api';
import { CodeAction, CodeActionParams, CodeActionRequest, Command, LanguageClient, RequestType } from 'vscode-languageclient/node';
// eslint-disable-next-line node/no-missing-import
export type { MatchPatternsToDocumentResult, NamedPattern, PatternMatch, PatternSettings, ServerMethods } from 'server-pattern-matcher/api';

export type PatternMatcherServerApi = ServerRequestApi;

type RequestCodeActionResult = (Command | CodeAction)[] | null;

export async function requestCodeAction(client: LanguageClient, params: CodeActionParams): Promise<RequestCodeActionResult> {
    const request = CodeActionRequest.type;
    const result = await client.sendRequest(request, params);
    return result;
}

export function createServerApi(client: LanguageClient): PatternMatcherServerApi {
    async function sendRequest<M extends keyof ServerMethods>(method: M, param: Req<ServerMethods[M]>): Promise<Res<ServerMethods[M]>> {
        const r = new RequestType<Req<ServerMethods[M]>, Res<ServerMethods[M]>, void>(method);
        const result = await client.sendRequest(r, param);
        return result;
    }

    const api: PatternMatcherServerApi = {
        matchPatternsInDocument: (param) => sendRequest('matchPatternsInDocument', param),
    };

    return api;
}
