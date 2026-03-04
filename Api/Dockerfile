FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["Api/Api.csproj", "Api/"]
RUN dotnet restore "Api/Api.csproj"

COPY . .
WORKDIR "/src/Api"

RUN dotnet publish "Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM public.ecr.aws/lambda/dotnet:10 AS final
WORKDIR /var/task

COPY --from=publish /app/publish .

CMD [ "Api" ]