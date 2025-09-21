import { Component } from "@angular/core";

@Component({
  selector: "app-tables",
  templateUrl: "./tables.component.html",
  styleUrls: ["./tables.component.scss"],
  standalone: false
})
export class TablesComponent {
  /*BASIC TABLE USAGE BEGIN*/
  dtBaseHtml: string = `<rlb-dt-table>
  <rlb-dt-header>ID</rlb-dt-header>
  <rlb-dt-header>Name</rlb-dt-header>
  <rlb-dt-header>Email</rlb-dt-header>
  <rlb-dt-row>
   <rlb-dt-cell>1</rlb-dt-cell>
   <rlb-dt-cell>George</rlb-dt-cell>
   <rlb-dt-cell>george&#64;gmail.com</rlb-dt-cell>
  </rlb-dt-row>
  <rlb-dt-row>
   <rlb-dt-cell>2</rlb-dt-cell>
   <rlb-dt-cell>Paul</rlb-dt-cell>
   <rlb-dt-cell>paul&#64;gmail.com</rlb-dt-cell>
  </rlb-dt-row>
  <rlb-dt-row>
   <rlb-dt-cell>3</rlb-dt-cell>
   <rlb-dt-cell>Alex</rlb-dt-cell>
   <rlb-dt-cell>alex&#64;gmail.com</rlb-dt-cell>
  </rlb-dt-row>
 </rlb-dt-table>`
  dtBaseTs: string = `import { Component } from "@angular/core";

@Component({
  selector: "app-tables",
  templateUrl: "./tables.component.html",
  styleUrls: ["./tables.component.scss"],
  standalone: false
})
export class TablesComponent {

}`
  /*BASIC TABLE USAGE END*/
  
   /*BASIC PAGINATION USAGE BEGIN*/
  dtBasePaginationHtml: string = `<rlb-dt-table
  [items]="users"
  [pagination-mode]="'pages'"
  [total-items]="users.length"
  [(current-page)]="page"
  [page-size]="3">
  <rlb-dt-header>ID</rlb-dt-header>
  <rlb-dt-header>Name</rlb-dt-header>
  <rlb-dt-header>Email</rlb-dt-header>
  <rlb-dt-row ngFor="let user of users">
   <rlb-dt-cell>{{user.id}}</rlb-dt-cell>
   <rlb-dt-cell>{{user.name}}</rlb-dt-cell>
   <rlb-dt-cell>{{user.email}}</rlb-dt-cell>
   <rlb-dt-actions>
    <rlb-dt-action (click)="onEdit(user)">Edit</rlb-dt-action>
    <rlb-dt-action (click)="onDelete(user)">Delete</rlb-dt-action>
   </rlb-dt-actions>
  </rlb-dt-row>
 </rlb-dt-table>`
  
  dtBasePaginationTs: string = `  users = [
    {id: 1, name: 'Pippo', email: 'pippo@gmail.com'},
    {id: 2, name: 'Pluto', email: 'pluto@gmail.com'},
    {id: 3, name: 'Paul', email: 'paul@gmail.com'},
  ]
  
  page: number = 1;
  
  onEdit(user: any) {
    console.log("Edit user", user);
  }
  
  onDelete(user: any) {
    console.log("Delete user", user);
  }`
  
  users = [
    {id: 1, name: 'Pippo', email: 'pippo@gmail.com'},
    {id: 2, name: 'Pluto', email: 'pluto@gmail.com'},
    {id: 3, name: 'Paul', email: 'paul@gmail.com'},
  ]
  
  page: number = 1;
  
  onEdit(user: any) {
    console.log("Edit user", user);
  }
  
  onDelete(user: any) {
    console.log("Delete user", user);
  }
  /*BASIC PAGINATION END*/
  
  /*BASIC LOAD-MORE BEGIN*/
  loadMoreHtml: string = `<rlb-dt-table
 [items]="users"
 [pagination-mode]="'load-more'"
 [loadMoreLabel]="'Load more users'"
 (load-more)="onLoadMore()"
 
 <rlb-dt-header>ID</rlb-dt-header>
 <rlb-dt-header>Name</rlb-dt-header>
 <rlb-dt-header>Email</rlb-dt-header>
 <rlb-dt-row ngFor="let user of usersLoadMore">
  <rlb-dt-cell>{{user.id}}</rlb-dt-cell>
  <rlb-dt-cell>{{user.name}}</rlb-dt-cell>
  <rlb-dt-cell>{{user.email}}</rlb-dt-cell>
 </rlb-dt-row>
</rlb-dt-table>`
  
  loadMoreTs: string = `  usersLoadMore = [
    {id: 1, name: 'Pippo', email: 'pippo@gmail.com'},
    {id: 2, name: 'Pluto', email: 'pluto@gmail.com'},
    {id: 3, name: 'Paul', email: 'paul@gmail.com'},
  ]
  onLoadMore() {
    this.usersLoadMore = [
      ...this.usersLoadMore,
      {id: 4, name: 'Mario', email: 'mario@gmail.com'},
      {id: 5, name: 'Luigi', email: 'luigi@gmail.com'}
    ];
  }`
  
  usersLoadMore = [
    {id: 1, name: 'Pippo', email: 'pippo@gmail.com'},
    {id: 2, name: 'Pluto', email: 'pluto@gmail.com'},
    {id: 3, name: 'Paul', email: 'paul@gmail.com'},
  ]
  onLoadMore() {
    this.usersLoadMore = [
      ...this.usersLoadMore,
      {id: 4, name: 'Mario', email: 'mario@gmail.com'},
      {id: 5, name: 'Luigi', email: 'luigi@gmail.com'}
    ];
  }
  /*BASIC LOAD-MORE END*/
  
  /*NO ITEMS EXAMPLE BEGIN*/
  noItemsHtml: string = `<rlb-dt-table [items]="[]">
  <rlb-dt-header>ID</rlb-dt-header>
  <rlb-dt-header>Name</rlb-dt-header>
  <rlb-dt-header>Email</rlb-dt-header>

  <rlb-dt-noitems>
   <rlb-alert>No users available.</rlb-alert>
  </rlb-dt-noitems>
 </rlb-dt-table>`
  
  noItemsTs: string = this.dtBaseTs
  /*NO ITEMS EXAMPLE END*/
  
  /*LOADING STATE EXAMPLE BEGIN*/
  loadingStateHtml: string = `<rlb-dt-table [items]="users" [loading]="true">
 <rlb-dt-header>ID</rlb-dt-header>
 <rlb-dt-header>Name</rlb-dt-header>
 <rlb-dt-header>Email</rlb-dt-header>

 <rlb-dt-loading>
  <rlb-spinner [color]="'primary'"></rlb-spinner>
 </rlb-dt-loading>
</rlb-dt-table>`
  
  loadingStateTs: string = this.dtBaseTs
  
  /*LOADING STATE EXAMPLE END*/
}