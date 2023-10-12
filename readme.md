# TODO
 - Dựng 2 CRUD Gồm User và Todo. Các todo có thể có chung người làm, Todo có thể đổi các status, comment
 - Mối quan hệ n-n : 1 user sẽ có nhiều todo, 1 todo thì sẽ có nhiều user
 - Y/c về tài liệu: E-R Diagram
 - Y/c về techincal: Sử dụng ExpressJS, có sử dụng Dockerize application,  - Sử dụng cả 2 cách ORM (typeorm, prisma,….) và dựng QueryBuiler, Db sử dụng Postgresql
## Note
 - Write Raw SQL Query and use Typeorm, not 2 database
 - Dockerize it with docker-compose and dockerfile(2+ container need both!)
 - Chose Typeorm

 ## ORM vs SQL query
 - [TypeOrm](https://typeorm.io/)
 - [Query builder](https://typeorm.io/select-query-builder)
 - [SQL query - Postgres NPM](https://www.npmjs.com/package/pg)

 ## Running Docker
 Running database
 - sudo docker-compose up db
 Go to Database CLI
 - sudo docker ps
 - sudo docker exec -it {Container ID} psql -U postgresUser -d twodatabase
 Check current database running
 - sudo ss -lptn 'sport = :5432'
 - sudo kill {pip ID}
 Run app
 - Development: npm run dev
 - Start both the container: sudo docker-compose up
 - Turn off containers: sudo docker-compose down


### Start the app
 - For development with NPM run dev, the app will use env in .env
 - For running docker, the app will use env in .env.prod