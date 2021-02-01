// This service is based on the `ng2-cookies` package which sadly is not a service and does
// not use `DOCUMENT` injection and therefore doesn't work well with AoT production builds.
// Package: https://github.com/BCJTI/ng2-cookies
import { Injectable, Inject, PLATFORM_ID, InjectionToken } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class CookieService {
    constructor(
    // The type `Document` may not be used here. Although a fix is on its way,
    // we will go with `any` for now to support Angular 2.4.x projects.
    // Issue: https://github.com/angular/angular/issues/12631
    // Fix: https://github.com/angular/angular/pull/14894
    document, 
    // Get the `PLATFORM_ID` so we can check if we're in a browser.
    platformId) {
        this.document = document;
        this.platformId = platformId;
        this.documentIsAccessible = isPlatformBrowser(this.platformId);
    }
    /**
     * @param name Cookie name
     * @returns boolean - whether cookie with specified name exists
     */
    check(name) {
        if (!this.documentIsAccessible) {
            return false;
        }
        name = encodeURIComponent(name);
        const regExp = this.getCookieRegExp(name);
        const exists = regExp.test(this.document.cookie);
        return exists;
    }
    /**
     * @param name Cookie name
     * @returns property value
     */
    get(name) {
        if (this.documentIsAccessible && this.check(name)) {
            name = encodeURIComponent(name);
            const regExp = this.getCookieRegExp(name);
            const result = regExp.exec(this.document.cookie);
            return this.safeDecodeURIComponent(result[1]);
        }
        else {
            return '';
        }
    }
    /**
     * @returns all the cookies in json
     */
    getAll() {
        if (!this.documentIsAccessible) {
            return {};
        }
        const cookies = {};
        const document = this.document;
        if (document.cookie && document.cookie !== '') {
            document.cookie.split(';').forEach((currentCookie) => {
                const [cookieName, cookieValue] = currentCookie.split('=');
                cookies[this.safeDecodeURIComponent(cookieName.replace(/^ /, ''))] = this.safeDecodeURIComponent(cookieValue);
            });
        }
        return cookies;
    }
    /**
     * @param name     Cookie name
     * @param value    Cookie value
     * @param expires  Number of days until the cookies expires or an actual `Date`
     * @param path     Cookie path
     * @param domain   Cookie domain
     * @param secure   Secure flag
     * @param sameSite OWASP samesite token `Lax`, `None`, or `Strict`. Defaults to `Lax`
     */
    set(name, value, expires, path, domain, secure, sameSite = 'Lax') {
        if (!this.documentIsAccessible) {
            return;
        }
        let cookieString = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';';
        if (expires) {
            if (typeof expires === 'number') {
                const dateExpires = new Date(new Date().getTime() + expires * 1000 * 60 * 60 * 24);
                cookieString += 'expires=' + dateExpires.toUTCString() + ';';
            }
            else {
                cookieString += 'expires=' + expires.toUTCString() + ';';
            }
        }
        if (path) {
            cookieString += 'path=' + path + ';';
        }
        if (domain) {
            cookieString += 'domain=' + domain + ';';
        }
        if (secure === false && sameSite === 'None') {
            secure = true;
            console.warn(`[ngx-cookie-service] Cookie ${name} was forced with secure flag because sameSite=None.` +
                `More details : https://github.com/stevermeister/ngx-cookie-service/issues/86#issuecomment-597720130`);
        }
        if (secure) {
            cookieString += 'secure;';
        }
        cookieString += 'sameSite=' + sameSite + ';';
        this.document.cookie = cookieString;
    }
    /**
     * @param name   Cookie name
     * @param path   Cookie path
     * @param domain Cookie domain
     */
    delete(name, path, domain, secure, sameSite = 'Lax') {
        if (!this.documentIsAccessible) {
            return;
        }
        this.set(name, '', new Date('Thu, 01 Jan 1970 00:00:01 GMT'), path, domain, secure, sameSite);
    }
    /**
     * @param path   Cookie path
     * @param domain Cookie domain
     */
    deleteAll(path, domain, secure, sameSite = 'Lax') {
        if (!this.documentIsAccessible) {
            return;
        }
        const cookies = this.getAll();
        for (const cookieName in cookies) {
            if (cookies.hasOwnProperty(cookieName)) {
                this.delete(cookieName, path, domain, secure, sameSite);
            }
        }
    }
    /**
     * @param name Cookie name
     * @returns property RegExp
     */
    getCookieRegExp(name) {
        const escapedName = name.replace(/([\[\]\{\}\(\)\|\=\;\+\?\,\.\*\^\$])/gi, '\\$1');
        return new RegExp('(?:^' + escapedName + '|;\\s*' + escapedName + ')=(.*?)(?:;|$)', 'g');
    }
    safeDecodeURIComponent(encodedURIComponent) {
        try {
            return decodeURIComponent(encodedURIComponent);
        }
        catch (_a) {
            // probably it is not uri encoded. return as is
            return encodedURIComponent;
        }
    }
}
CookieService.ɵprov = i0.ɵɵdefineInjectable({ factory: function CookieService_Factory() { return new CookieService(i0.ɵɵinject(i1.DOCUMENT), i0.ɵɵinject(i0.PLATFORM_ID)); }, token: CookieService, providedIn: "root" });
CookieService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
CookieService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: InjectionToken, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29va2llLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtY29va2llLXNlcnZpY2Uvc3JjL2xpYi9jb29raWUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwyRkFBMkY7QUFDM0YsMkZBQTJGO0FBQzNGLGdEQUFnRDtBQUVoRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7O0FBSzlELE1BQU0sT0FBTyxhQUFhO0lBR3hCO0lBQ0UsMEVBQTBFO0lBQzFFLG1FQUFtRTtJQUNuRSx5REFBeUQ7SUFDekQscURBQXFEO0lBQzNCLFFBQWE7SUFDdkMsK0RBQStEO0lBQ2xDLFVBQWtDO1FBRnJDLGFBQVEsR0FBUixRQUFRLENBQUs7UUFFVixlQUFVLEdBQVYsVUFBVSxDQUF3QjtRQUUvRCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsSUFBWTtRQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFO1lBQzlCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxJQUFJLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFaEMsTUFBTSxNQUFNLEdBQVcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsRCxNQUFNLE1BQU0sR0FBWSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFMUQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7T0FHRztJQUNILEdBQUcsQ0FBQyxJQUFZ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LFdBQVcsR0FBRyxRQUFRLEdBQUcsV0FBVyxHQUFHLGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzNGLENBQUM7SUFFTyxzQkFBc0IsQ0FBQyxtQkFBMkI7UUFDeEQsSUFBSTtZQUNGLE9BQU8sa0JBQWtCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztTQUNoRDtRQUFDLFdBQU07WUFDTiwrQ0FBK0M7WUFDL0MsT0FBTyxtQkFBbUIsQ0FBQztTQUM1QjtJQUNILENBQUM7Ozs7WUFuTEYsVUFBVSxTQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25COzs7NENBU0ksTUFBTSxTQUFDLFFBQVE7WUFkc0IsY0FBYyx1QkFnQm5ELE1BQU0sU0FBQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhpcyBzZXJ2aWNlIGlzIGJhc2VkIG9uIHRoZSBgbmcyLWNvb2tpZXNgIHBhY2thZ2Ugd2hpY2ggc2FkbHkgaXMgbm90IGEgc2VydmljZSBhbmQgZG9lc1xuLy8gbm90IHVzZSBgRE9DVU1FTlRgIGluamVjdGlvbiBhbmQgdGhlcmVmb3JlIGRvZXNuJ3Qgd29yayB3ZWxsIHdpdGggQW9UIHByb2R1Y3Rpb24gYnVpbGRzLlxuLy8gUGFja2FnZTogaHR0cHM6Ly9naXRodWIuY29tL0JDSlRJL25nMi1jb29raWVzXG5cbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdCwgUExBVEZPUk1fSUQsIEluamVjdGlvblRva2VuIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBET0NVTUVOVCwgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgQ29va2llU2VydmljZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgZG9jdW1lbnRJc0FjY2Vzc2libGU6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgLy8gVGhlIHR5cGUgYERvY3VtZW50YCBtYXkgbm90IGJlIHVzZWQgaGVyZS4gQWx0aG91Z2ggYSBmaXggaXMgb24gaXRzIHdheSxcbiAgICAvLyB3ZSB3aWxsIGdvIHdpdGggYGFueWAgZm9yIG5vdyB0byBzdXBwb3J0IEFuZ3VsYXIgMi40LnggcHJvamVjdHMuXG4gICAgLy8gSXNzdWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzEyNjMxXG4gICAgLy8gRml4OiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL3B1bGwvMTQ4OTRcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBhbnksXG4gICAgLy8gR2V0IHRoZSBgUExBVEZPUk1fSURgIHNvIHdlIGNhbiBjaGVjayBpZiB3ZSdyZSBpbiBhIGJyb3dzZXIuXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBJbmplY3Rpb25Ub2tlbjxvYmplY3Q+XG4gICkge1xuICAgIHRoaXMuZG9jdW1lbnRJc0FjY2Vzc2libGUgPSBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBuYW1lIENvb2tpZSBuYW1lXG4gICAqIEByZXR1cm5zIGJvb2xlYW4gLSB3aGV0aGVyIGNvb2tpZSB3aXRoIHNwZWNpZmllZCBuYW1lIGV4aXN0c1xuICAgKi9cbiAgY2hlY2sobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLmRvY3VtZW50SXNBY2Nlc3NpYmxlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbmFtZSA9IGVuY29kZVVSSUNvbXBvbmVudChuYW1lKTtcblxuICAgIGNvbnN0IHJlZ0V4cDogUmVnRXhwID0gdGhpcy5nZXRDb29raWVSZWdFeHAobmFtZSk7XG4gICAgY29uc3QgZXhpc3RzOiBib29sZWFuID0gcmVnRXhwLnRlc3QodGhpcy5kb2N1bWVudC5jb29raWUpO1xuXG4gICAgcmV0dXJuIGV4aXN0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gbmFtZSBDb29raWUgbmFtZVxuICAgKiBAcmV0dXJucyBwcm9wZXJ0eSB2YWx1ZVxuICAgKi9cbiAgZ2V0KG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuZG9jdW1lbnRJc0FjY2Vzc2libGUgJiYgdGhpcy5jaGVjayhuYW1lKSkge1xuICAgICAgbmFtZSA9IGVuY29kZVVSSUNvbXBvbmVudChuYW1lKTtcblxuICAgICAgY29uc3QgcmVnRXhwOiBSZWdFeHAgPSB0aGlzLmdldENvb2tpZVJlZ0V4cChuYW1lKTtcbiAgICAgIGNvbnN0IHJlc3VsdDogUmVnRXhwRXhlY0FycmF5ID0gcmVnRXhwLmV4ZWModGhpcy5kb2N1bWVudC5jb29raWUpO1xuXG4gICAgICByZXR1cm4gdGhpcy5zYWZlRGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdFsxXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMgYWxsIHRoZSBjb29raWVzIGluIGpzb25cbiAgICovXG4gIGdldEFsbCgpOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9IHtcbiAgICBpZiAoIXRoaXMuZG9jdW1lbnRJc0FjY2Vzc2libGUpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICBjb25zdCBjb29raWVzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG4gICAgY29uc3QgZG9jdW1lbnQ6IGFueSA9IHRoaXMuZG9jdW1lbnQ7XG5cbiAgICBpZiAoZG9jdW1lbnQuY29va2llICYmIGRvY3VtZW50LmNvb2tpZSAhPT0gJycpIHtcbiAgICAgIGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpLmZvckVhY2goKGN1cnJlbnRDb29raWUpID0+IHtcbiAgICAgICAgY29uc3QgW2Nvb2tpZU5hbWUsIGNvb2tpZVZhbHVlXSA9IGN1cnJlbnRDb29raWUuc3BsaXQoJz0nKTtcbiAgICAgICAgY29va2llc1t0aGlzLnNhZmVEZWNvZGVVUklDb21wb25lbnQoY29va2llTmFtZS5yZXBsYWNlKC9eIC8sICcnKSldID0gdGhpcy5zYWZlRGVjb2RlVVJJQ29tcG9uZW50KGNvb2tpZVZhbHVlKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBjb29raWVzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBuYW1lICAgICBDb29raWUgbmFtZVxuICAgKiBAcGFyYW0gdmFsdWUgICAgQ29va2llIHZhbHVlXG4gICAqIEBwYXJhbSBleHBpcmVzICBOdW1iZXIgb2YgZGF5cyB1bnRpbCB0aGUgY29va2llcyBleHBpcmVzIG9yIGFuIGFjdHVhbCBgRGF0ZWBcbiAgICogQHBhcmFtIHBhdGggICAgIENvb2tpZSBwYXRoXG4gICAqIEBwYXJhbSBkb21haW4gICBDb29raWUgZG9tYWluXG4gICAqIEBwYXJhbSBzZWN1cmUgICBTZWN1cmUgZmxhZ1xuICAgKiBAcGFyYW0gc2FtZVNpdGUgT1dBU1Agc2FtZXNpdGUgdG9rZW4gYExheGAsIGBOb25lYCwgb3IgYFN0cmljdGAuIERlZmF1bHRzIHRvIGBMYXhgXG4gICAqL1xuICBzZXQoXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIHZhbHVlOiBzdHJpbmcsXG4gICAgZXhwaXJlcz86IG51bWJlciB8IERhdGUsXG4gICAgcGF0aD86IHN0cmluZyxcbiAgICBkb21haW4/OiBzdHJpbmcsXG4gICAgc2VjdXJlPzogYm9vbGVhbixcbiAgICBzYW1lU2l0ZTogJ0xheCcgfCAnTm9uZScgfCAnU3RyaWN0JyA9ICdMYXgnXG4gICk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kb2N1bWVudElzQWNjZXNzaWJsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBjb29raWVTdHJpbmc6IHN0cmluZyA9IGVuY29kZVVSSUNvbXBvbmVudChuYW1lKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkgKyAnOyc7XG5cbiAgICBpZiAoZXhwaXJlcykge1xuICAgICAgaWYgKHR5cGVvZiBleHBpcmVzID09PSAnbnVtYmVyJykge1xuICAgICAgICBjb25zdCBkYXRlRXhwaXJlczogRGF0ZSA9IG5ldyBEYXRlKG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgZXhwaXJlcyAqIDEwMDAgKiA2MCAqIDYwICogMjQpO1xuXG4gICAgICAgIGNvb2tpZVN0cmluZyArPSAnZXhwaXJlcz0nICsgZGF0ZUV4cGlyZXMudG9VVENTdHJpbmcoKSArICc7JztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvb2tpZVN0cmluZyArPSAnZXhwaXJlcz0nICsgZXhwaXJlcy50b1VUQ1N0cmluZygpICsgJzsnO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwYXRoKSB7XG4gICAgICBjb29raWVTdHJpbmcgKz0gJ3BhdGg9JyArIHBhdGggKyAnOyc7XG4gICAgfVxuXG4gICAgaWYgKGRvbWFpbikge1xuICAgICAgY29va2llU3RyaW5nICs9ICdkb21haW49JyArIGRvbWFpbiArICc7JztcbiAgICB9XG5cbiAgICBpZiAoc2VjdXJlID09PSBmYWxzZSAmJiBzYW1lU2l0ZSA9PT0gJ05vbmUnKSB7XG4gICAgICBzZWN1cmUgPSB0cnVlO1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBgW25neC1jb29raWUtc2VydmljZV0gQ29va2llICR7bmFtZX0gd2FzIGZvcmNlZCB3aXRoIHNlY3VyZSBmbGFnIGJlY2F1c2Ugc2FtZVNpdGU9Tm9uZS5gICtcbiAgICAgICAgICBgTW9yZSBkZXRhaWxzIDogaHR0cHM6Ly9naXRodWIuY29tL3N0ZXZlcm1laXN0ZXIvbmd4LWNvb2tpZS1zZXJ2aWNlL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtNTk3NzIwMTMwYFxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHNlY3VyZSkge1xuICAgICAgY29va2llU3RyaW5nICs9ICdzZWN1cmU7JztcbiAgICB9XG5cbiAgICBjb29raWVTdHJpbmcgKz0gJ3NhbWVTaXRlPScgKyBzYW1lU2l0ZSArICc7JztcblxuICAgIHRoaXMuZG9jdW1lbnQuY29va2llID0gY29va2llU3RyaW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBuYW1lICAgQ29va2llIG5hbWVcbiAgICogQHBhcmFtIHBhdGggICBDb29raWUgcGF0aFxuICAgKiBAcGFyYW0gZG9tYWluIENvb2tpZSBkb21haW5cbiAgICovXG4gIGRlbGV0ZShuYW1lOiBzdHJpbmcsIHBhdGg/OiBzdHJpbmcsIGRvbWFpbj86IHN0cmluZywgc2VjdXJlPzogYm9vbGVhbiwgc2FtZVNpdGU6ICdMYXgnIHwgJ05vbmUnIHwgJ1N0cmljdCcgPSAnTGF4Jyk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kb2N1bWVudElzQWNjZXNzaWJsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2V0KG5hbWUsICcnLCBuZXcgRGF0ZSgnVGh1LCAwMSBKYW4gMTk3MCAwMDowMDowMSBHTVQnKSwgcGF0aCwgZG9tYWluLCBzZWN1cmUsIHNhbWVTaXRlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gcGF0aCAgIENvb2tpZSBwYXRoXG4gICAqIEBwYXJhbSBkb21haW4gQ29va2llIGRvbWFpblxuICAgKi9cbiAgZGVsZXRlQWxsKHBhdGg/OiBzdHJpbmcsIGRvbWFpbj86IHN0cmluZywgc2VjdXJlPzogYm9vbGVhbiwgc2FtZVNpdGU6ICdMYXgnIHwgJ05vbmUnIHwgJ1N0cmljdCcgPSAnTGF4Jyk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kb2N1bWVudElzQWNjZXNzaWJsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNvb2tpZXM6IGFueSA9IHRoaXMuZ2V0QWxsKCk7XG5cbiAgICBmb3IgKGNvbnN0IGNvb2tpZU5hbWUgaW4gY29va2llcykge1xuICAgICAgaWYgKGNvb2tpZXMuaGFzT3duUHJvcGVydHkoY29va2llTmFtZSkpIHtcbiAgICAgICAgdGhpcy5kZWxldGUoY29va2llTmFtZSwgcGF0aCwgZG9tYWluLCBzZWN1cmUsIHNhbWVTaXRlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIG5hbWUgQ29va2llIG5hbWVcbiAgICogQHJldHVybnMgcHJvcGVydHkgUmVnRXhwXG4gICAqL1xuICBwcml2YXRlIGdldENvb2tpZVJlZ0V4cChuYW1lOiBzdHJpbmcpOiBSZWdFeHAge1xuICAgIGNvbnN0IGVzY2FwZWROYW1lOiBzdHJpbmcgPSBuYW1lLnJlcGxhY2UoLyhbXFxbXFxdXFx7XFx9XFwoXFwpXFx8XFw9XFw7XFwrXFw/XFwsXFwuXFwqXFxeXFwkXSkvZ2ksICdcXFxcJDEnKTtcblxuICAgIHJldHVybiBuZXcgUmVnRXhwKCcoPzpeJyArIGVzY2FwZWROYW1lICsgJ3w7XFxcXHMqJyArIGVzY2FwZWROYW1lICsgJyk9KC4qPykoPzo7fCQpJywgJ2cnKTtcbiAgfVxuXG4gIHByaXZhdGUgc2FmZURlY29kZVVSSUNvbXBvbmVudChlbmNvZGVkVVJJQ29tcG9uZW50OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGVuY29kZWRVUklDb21wb25lbnQpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gcHJvYmFibHkgaXQgaXMgbm90IHVyaSBlbmNvZGVkLiByZXR1cm4gYXMgaXNcbiAgICAgIHJldHVybiBlbmNvZGVkVVJJQ29tcG9uZW50O1xuICAgIH1cbiAgfVxufVxuIl19