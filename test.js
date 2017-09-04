const Clutter = imports.gi.Clutter;
const Gio = imports.gi.Gio;

Clutter.init(null);

let stage = new Clutter.Stage();

let texture = new Clutter.Texture({ filename: 'sheepthing.png' });

let hShader = new Clutter.ShaderEffect({
    shader_type: Clutter.ShaderType.FRAGMENT_SHADER
});
let vShader = new Clutter.ShaderEffect({
    shader_type: Clutter.ShaderType.FRAGMENT_SHADER
});

let shaderGlsl = readFile(
    "./blur.glsl"
);

hShader.set_shader_source(shaderGlsl);
hShader.set_uniform_value('dir', 0.0);
hShader.set_uniform_value('width', texture.get_width());
hShader.set_uniform_value('height', texture.get_height());
hShader.set_uniform_value('radius', 15.0);
hShader.set_uniform_value('brightness', 0.9999);

vShader.set_shader_source(shaderGlsl);
vShader.set_uniform_value('dir', 1.0);
vShader.set_uniform_value('width', texture.get_width());
vShader.set_uniform_value('height', texture.get_height());
vShader.set_uniform_value('radius', 15.0);
vShader.set_uniform_value('brightness', 0.9999);

texture.add_effect_with_name("hBlur", hShader);
texture.add_effect_with_name("vBlur", vShader);

stage.add_actor(texture);
stage.show();

Clutter.main();


function readFile(filename) {
    let filePointer = Gio.file_new_for_path(filename);
    let fileSize    = filePointer.query_info("standard::size",  Gio.FileQueryInfoFlags.NONE, null).get_size();
    let fileStream  = filePointer.read(null);
    let fileData    = fileStream.read_bytes(fileSize, null).get_data();

    fileStream.close(null);

    return fileData.toString();
}
