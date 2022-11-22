#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["FamilyHubs.ServiceDirectory.Web/FamilyHubs.ServiceDirectory.Web.csproj", "FamilyHubs.ServiceDirectory.Web/"]
RUN dotnet restore "FamilyHubs.ServiceDirectory.Web/FamilyHubs.ServiceDirectory.Web.csproj"
COPY . .
WORKDIR "/src/FamilyHubs.ServiceDirectory.Web"
RUN dotnet build "FamilyHubs.ServiceDirectory.Web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "FamilyHubs.ServiceDirectory.Web.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FamilyHubs.ServiceDirectory.Web.dll"]