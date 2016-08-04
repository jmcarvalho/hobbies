import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Book } from './book';
import { AppConfig } from '../config';
import { AuthService } from '../authentication/auth.service';

@Component({
    template: require('./book-list.component.html'),
    directives: [ROUTER_DIRECTIVES]
})
export class BookListComponent implements OnInit {

    books: Observable<Book[]>;

    constructor(
        private http: Http,
        private config: AppConfig,
        private auth: AuthService
    ) {}

    ngOnInit() {
        const url = this.config.apiUrl + '/books';
        this.books = this.http.get(url, this.auth.authHeader)
        .map(res => {
            const books = res.json();
            books.forEach((book: any) => book.completed = new Date(book.completed));
            return books;
        });
    }

    /*
     * Date pipe doesn't work in Safari.
     * TO DO: Move to a service.
     */
    formatDate(date: Date) {
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        if(!date) return null;
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        return `${months[month]} ${day}, ${year}`;
    }
}