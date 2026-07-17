FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    nmap \
    ttyd \
    bash-completion \
    curl \
    wget \
    net-tools \
    iputils-ping \
    dnsutils \
    traceroute \
    whois \
    netcat-openbsd \
    tcpdump \
    && rm -rf /var/lib/apt/lists/*

# Create workspace for scan results
RUN mkdir -p /scans

# Copy helper scripts
COPY scripts/ /usr/local/bin/
RUN chmod +x /usr/local/bin/*.sh

WORKDIR /scans

EXPOSE 7681

# ttyd serves a bash shell on port 7681
# --writable allows input, -t fontSize=16 for readability
CMD ["ttyd", "--port", "7681", "--writable", "-t", "fontSize=16", "-t", "theme={'background':'#0a0a0a','foreground':'#ffffff','cursor':'#39ff14','selectionBackground':'#39ff1440'}", "bash"]
