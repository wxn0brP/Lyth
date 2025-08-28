const url = "https://discord.com/api/download?platform=linux&format=tar.gz";

async function getDiscordDownloadUrl(): Promise<string> {
    const response = await fetch(
        url,
        { method: "HEAD", redirect: "manual" }
    );

    const location = response.headers.get("location");
    return location as any;
}

const downloadUrl = await getDiscordDownloadUrl();
const version = downloadUrl.split("/").slice(-2)[0];

export default version;
export { version, downloadUrl, url };