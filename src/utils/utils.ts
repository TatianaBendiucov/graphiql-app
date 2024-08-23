import { headers } from "next/headers";

export const encodeBase64 = (input: string): string => {
    return Buffer.from(input, "utf-8").toString("base64");
};

interface BuildGraphQLUrlParams {
    endpoint: string,
    body: string,
    headers: { key: string; value: string }[] | null
}

export const buildGraphQLUrl = ({
    endpoint,
    body,
    headers,
}: BuildGraphQLUrlParams): string => {
    const encodedEndpoint = encodeBase64(endpoint);
    const encodedBody = encodeBase64(body);

    let url = `http://localhost:3000/GRAPHQL/${encodedEndpoint}/${encodedBody}`;

    if (headers) {
        const headerParams = headers
            .filter(header => header.key && header.value)
            .map(header => `${encodeURIComponent(header.key)}=${encodeURIComponent(header.value)}`)
            .join('&');

        if (headerParams) {
            url += `?${headerParams}`;
        }
    }

    return url;
};