export class AlbumTrack {
    discNo = 1;
    serial= 0;
    title = '';
    duration = '';
}
export class AlbumDisc {
    id = 0;
    serial = 0;
    tracks = <AlbumTrack>[];
}

export const parseAlbumTracks = (discNo: Number, input: string): AlbumTrack[] => {
    const lines = input.split("\n").filter(line => line.trim() !== ""); // 按行分割并去掉空行
    return lines.map(line => {
        // 使用正则匹配每行的曲目信息
        const match = line.match(/^(\d+)\s+(.*?)\s+(\d+:\d+)$/);
        if (!match) {
            throw new Error(`无法解析的行: ${line}`);
        }

        const serial = parseInt(match[1], 10); // 提取编号并转换为数字
        let title = match[2].replace(/\s*\(M\d+\)\s*/g, "").trim(); // 去掉 (Mx) 部分
        const duration = match[3]; // 提取时长部分

        return {
            discNo,
            serial,
            title,
            duration,
        };
    });
}