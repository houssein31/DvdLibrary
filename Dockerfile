# Use the official Maven image to build the application with Java 17
FROM maven:3.8.4-openjdk-17-slim AS build

# Set the working directory
WORKDIR /Taskitory

# Copy the pom.xml and source code to the working directory
COPY pom.xml .
COPY src ./src

# Package the application and skip tests
RUN mvn clean package -DskipTests=true

# Use a different OpenJDK image to run the application with Java 17
FROM openjdk:17-slim

# Set the working directory for the runtime container
WORKDIR /app

# Copy the jar file from the build stage
COPY --from=build /Taskitory/target/*.jar app.jar

# Set environment variables for the database connection
ENV DB_HOST=dpg-csgpnmogph6c73bqlvt0-a.virginia-postgres.render.com
ENV DB_PORT=5432
ENV DB_NAME=dvdlibrarydb
ENV DB_USERNAME=housseindev
ENV DB_PASSWORD=dgrD8SGxkK9ssYnEv3kJBUBmoFsawsIJ
ENV SPRING_DATASOURCE_DRIVER-CLASS-NAME=org.postgresql.Driver
ENV SPRING_JPA_HIBERNATE_DDL-AUTO=update
ENV SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect
ENV SPRING_APPLICATION_NAME=DVD-Library

# Set the command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
