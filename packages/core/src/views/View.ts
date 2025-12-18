export class View {
  static render(template: string, data: any = {}): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title || 'Flush App'}</title>
</head>
<body>
    <h1>${template}</h1>
    <pre>${JSON.stringify(data, null, 2)}</pre>
</body>
</html>`;
  }
  
  static json(data: any): string {
    return JSON.stringify(data, null, 2);
  }
}