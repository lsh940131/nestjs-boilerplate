# Nestjs-boilerplate

prisma, swagger

## Environment

-   node `v20.16.0`
-   mysql `8.0.36`

## Port

-   server: 3000
-   mysql: 3306

## Api docs

-   [link](http://localhost:3000/api/docs)
-   **id**: _root_ / **password**: _admin_

### how to run for developing in local

1. npm install -g @nestjs/cli
2. npm i
3. npx prisma generate
    > Create prisma client model using schema.prisma  
    > If change model in schema.prisma, run this cmd
4. npx prisma db push
    > Notice! you have to run mysql in local
    > Caution! this cmd change db schema using schema.prisma
5. npm run start:dev

-   etc
    -   if you use [vscode](https://code.visualstudio.com/), install [prisma ext](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)
    -   if you pull schema from db with prisma cmd, you can easily convert the letter-case-style ["pascal", "camel", "snake"] using this [prisma-case-format](https://www.npmjs.com/package/prisma-case-format)

### how to run testcode

`npm run test:ver`

-   this cmd runs all test files(\*.spec.ts) and shows the progress

`npm run test:cov`

-   this cmd runs all service test code files(\*.service.ts) and show coverage with all service file
