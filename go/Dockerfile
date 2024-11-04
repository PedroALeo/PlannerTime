# Start from a base Go image
FROM golang:1.23.1 AS build

# Create app directory and copy source code
WORKDIR /app
COPY . .

RUN go build -o main

# Run the Go application
CMD ["./main"]
