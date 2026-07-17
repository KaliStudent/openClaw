FROM python:3.11-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    nmap \
    xsltproc \
    curl \
    iputils-ping \
    dnsutils \
    traceroute \
    whois \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /app/scans /app/db

EXPOSE 8080

CMD ["python", "server.py"]
