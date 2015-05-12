# General Lumen changes

- Facades, Eloquent and DotEnv are enabled.  Comment the lines in `bootstrap/app.php` out if you don't need them.
- Configs folder added.  If you want to add a config file, look to [Lumen Docs](http://lumen.laravel.com/docs/configuration#configuration-files).
- `app/Http/routes.php` contains a `/status` route that will return a 200 response with JSON "ok".

# Models

- All models return collections as an instance of `App\Support\Collection`.
- All models can now tap `->hashId` to get a hashed version of it's id.
- All models now have `findHash()`.  This works the same as `find()` but expects the hashed id.
- All models are expected to set a `HASH_ID` constant.  This will be the models salt.
    - This is checked in the `BaseModel` constructor and will throw an exception if it's not found.

# Transformers

- Docs: [Fractal](http://fractal.thephpleague.com/transformers/)
- Example Class

```

    <?php namespace App\Transformers;
    
    use App\Models\Video;
    
    class VideoTransformer extends BaseTransformer {

	public function transform(Video $video)
	{
		return [
			'id' => $video->hashId
		];
	}

    }
```

