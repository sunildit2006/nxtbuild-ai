export const parseGenerationResponse = (response) => {
  const htmlMatch = response.match(/```html\s*([\s\S]*?)```/i);

  if (htmlMatch) {
    const code = htmlMatch[1].trim();

    const description = response
      .replace(htmlMatch[0], '')
      .trim();

    return {
      description,
      code,
    };
  }

  const codeMatch = response.match(/```\s*([\s\S]*?)```/);

  if (codeMatch) {
    const code = codeMatch[1].trim();

    const description = response
      .replace(codeMatch[0], '')
      .trim();

    return {
      description,
      code,
    };
  }

  return {
    description: response.trim(),
    code: '',
  };
};