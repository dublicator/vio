import * as FS from 'fs';
import * as Path from 'path';

import {
    Controller,
    Request,
    ExpectedError,
    PermissionDescriptor as PD,
    Redirection,
    JSONRedirection,
    JSONResponse,
    Response,
    get,
    post,
    route
} from '../../';

import { TestPermissionDescriptor, TestRoles } from '../modules/user-provider';

// test vio require
import * as Test1 from '../modules/test';
import * as Test2 from '../modules/test';

import '../../../src/test/modules/bom-test';

export default class DefaultController extends Controller {
    @get()
    default() {
        return {
            content: 'default'
        };
    }
    
    @route('get')
    list() {
        return 'list';
    }
    
    @post({
        path: 'u/:user'
    })
    user(req: Request<any>) {
        return req.params['user'];
    }
    
    @get()
    oops() {
        throw new ExpectedError(0, 'html 500');
    }
    
    @get()
    ouch() {
        throw new ExpectedError(1234);
    }
    
    @get()
    moduleCache() {
        return Test1.foo === Test2.foo;
    }
    
    @get({
        permission: TestPermissionDescriptor.admin
    })
    permissionDenied() { }
    
    @get({
        permissions: [TestPermissionDescriptor.admin, TestPermissionDescriptor.user]
    })
    permissionGranted() { }
    
    @get({
        permission: PD.and(TestPermissionDescriptor.admin, TestPermissionDescriptor.user)
    })
    permissionDeniedAnd() { }
    
    @get({
        authentication: true,
        permission: PD.and(TestPermissionDescriptor.admin, TestPermissionDescriptor.user)
    })
    permissionGrantedAnd() { }
    
    @get()
    redirect() {
        return new Redirection('/');
    }
    
    @get()
    jsonRedirect() {
        return new JSONRedirection('/');
    }
    
    @get()
    jsonResponse() {
        return new JSONResponse({
            foo: 'bar'
        });
    }
    
    @get()
    streamResponse() {
        let path = Path.join(__dirname, '../../../src/test/data/stream.txt');
        let stream = FS.createReadStream(path);
        
        return new Response('text/html', stream);
    }
}
