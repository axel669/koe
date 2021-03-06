const template = (options) => `<!doctype html>
<html>
    <head>
        <title>${options.title}</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width" />
        <link rel="icon" type="image/png" href="https://axel669.net/images/megaman-rounded.png" />
    </head>

    <body>
        <script src="https://js.pusher.com/7.0/pusher.min.js"></script>
        <script src="/${options.files.js[0].fileName}"></script>
    </body>
</html>
`

export default template
