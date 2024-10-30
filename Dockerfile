# Use the official Maven image to build the application with Java 17
FROM maven:3.8.5-openjdk-17 AS build

# Set the working directory
WORKDIR /app

# Copy the pom.xml and other necessary files
COPY pom.xml .
COPY src ./src

# Package the application
RUN mvn clean package -DskipTests

# Use a different OpenJDK image to run the application with Java 17
FROM openjdk:17-slim

# Set the working directory
WORKDIR /app

# Copy the jar file from the build stage
COPY --from=build /app/target/DVD-Library-0.0.1-SNAPSHOT.jar app.jar

# Specify the command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

# Optional: Uncomment the following lines if you want to pass environment variables for credentials
# ENV SPRING_DATASOURCE_URL=jdbc:postgresql://dpg-csgpnmogph6c73bqlvt0-a.virginia-postgres.render.com:5432/dvdlibrarydb
# ENV SPRING_DATASOURCE_USERNAME=housseindev
# ENV SPRING_DATASOURCE_PASSWORD=dgrD8SGxkK9ssYnEv3kJBUBmoFsawsIJ
