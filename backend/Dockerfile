FROM gradle:8.10-jdk21-alpine AS builder

WORKDIR /build

COPY settings.gradle build.gradle ./
RUN gradle dependencies --no-daemon

COPY src ./src
RUN gradle bootJar --no-daemon -x test

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

RUN addgroup -S spotbook && adduser -S spotbook -G spotbook && \
    apk add --no-cache curl

COPY --from=builder /build/build/libs/spotbook-backend-1.0.0.jar app.jar

USER spotbook:spotbook

EXPOSE 8080

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
