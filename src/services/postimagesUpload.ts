interface UploadResponse {
  status: string;
  data: {
    url: string;
    direct_link: string;
    thumb_url: string;
  };
}

export async function uploadToPostimages(file: File): Promise<string> {
  const formData = new FormData();

  const fileName = file.name.split('.');
  const name = fileName[0];
  const type = fileName[fileName.length - 1];

  formData.append('key', 'c3bc40a1134353de9d2db593d5d2534f');
  formData.append('gallery', '2Bg7L37');
  formData.append('o', '2b819584285c102318568238c7d4a4c7');
  formData.append('m', '59c2ad4b46b0c1e12d5703302bff0120');
  formData.append('name', name);
  formData.append('type', type);
  formData.append('image', file);
  formData.append('numfiles', '1');
  formData.append('optsize', '0');
  formData.append('expire', '0');
  formData.append('adult', '0');

  try {
    const response = await fetch('https://api.postimage.org/1/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const data: UploadResponse = await response.json();

    if (data.status === 'success' && data.data?.direct_link) {
      return data.data.direct_link;
    } else {
      throw new Error('Upload succeeded but no direct link was returned');
    }
  } catch (error) {
    console.error('Postimages upload error:', error);
    throw new Error('Failed to upload image to Postimages');
  }
}
