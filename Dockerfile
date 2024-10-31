# Use Maven to build the application
FROM maven:3.8.4-openjdk-17-slim AS build
COPY . .
RUN mvn clean package -DskipTests

# Set up the runtime environment
FROM openjdk:17-slim
COPY --from=build /target/DVD-Library-0.0.1-SNAPSHOT.jar DVD-Library.jar

# Set environment variables
ENV DB_HOST=${DATABASE_ADDR_ALIAS}
ENV DB_PORT=${DATABASE_PORT}
ENV DB_NAME=${DATABASE_NAME}
ENV DB_USERNAME=${DATABASE_CLIENT_USER}
ENV DB_PASSWORD=${DATABASE_CLIENT_PW}

# Expose the application port
EXPOSE 8080

# Set entrypoint
ENTRYPOINT ["java", "-jar", "DVD-Library.jar"]
