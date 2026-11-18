type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface HttpRequest {
    readonly method: HttpMethod;
    readonly url: string;
    readonly headers: Readonly<Record<string, string>>;
    readonly query: Readonly<Record<string, string>>;
    readonly body?: unknown;
}

// Builder
class RequestBuilder {
    #method: HttpMethod = "GET";
    #url: string | undefined;
    #headers: Record<string, string> = {};
    #query: Record<string, string> = {};
    #body: unknown;

    withMethod(method: HttpMethod): this {
        this.#method = method;
        return this;
    }

    withUrl(url: string): this {
        this.#url = url;
        return this;
    }

    withHeader(name: string, value: string): this {
        this.#headers[name] = value;
        return this;
    }

    withQuery(name: string, value: string): this {
        this.#query[name] = value;
        return this;
    }

    withJsonBody(body: unknown): this {
        this.#body = body;
        return this;
    }

    build(): HttpRequest {
        if (this.#url === undefined) {
            throw new Error("Cannot build request: URL is missing");
        }
        const needsBody = this.#method === "POST" || this.#method === "PUT" || this.#method === "PATCH";
        if (needsBody && this.#body === undefined) {
            throw new Error(`Cannot build request: ${this.#method} needs a body`);
        }

        return {
            method: this.#method,
            url: this.#url,
            headers: { ...this.#headers },
            query: { ...this.#query },
            body: this.#body,
        };
    }
}

const getRequest = new RequestBuilder()
    .withUrl("https://api.example.com/books")
    .withHeader("Accept", "application/json")
    .withQuery("author", "Herbert")
    .build();
console.log('getRequest');
console.log(getRequest);

const postRequest = new RequestBuilder()
    .withMethod("POST")
    .withUrl("https://api.example.com/books")
    .withHeader("Content-Type", "application/json")
    .withJsonBody({ title: "Dune" })
    .build();
console.log('postRequest');
console.log(postRequest);

try {
    new RequestBuilder().withMethod("GET").build();
} catch (error) {
    console.log(error instanceof Error ? error.message : error);
}

try {
    new RequestBuilder().withMethod("POST").withUrl("https://api.example.com/books").build();
} catch (error) {
    console.log(error instanceof Error ? error.message : error);
}

// getRequest.url = "https://other.com";
