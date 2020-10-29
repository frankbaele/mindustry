From openjdk:8-jre-slim
RUN apt-get update
RUN apt-get install curl -y
RUN curl -L https://github.com/Anuken/Mindustry/releases/download/v111/server-release.jar > server-release.jar
