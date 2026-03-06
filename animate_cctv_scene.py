"""
=======================================================================
  CCTV Security Scene - Blender 4.x Python Script
  Photorealistic 3D Animation: Corridor → Thief → Alarm → Police
=======================================================================

HOW TO RUN:
  1. Open Blender (4.x recommended)
  2. Go to Scripting tab
  3. Click "Open" and select this file  (OR paste it directly)
  4. Click "Run Script"
  5. Press Ctrl+F12 to render the full animation

  OR run headless from terminal:
    "C:\Program Files\Blender Foundation\Blender 4.x\blender.exe" -b -P animate_cctv_scene.py -- --render

OUTPUT:
  Renders to: //render/frame####.png (then compiled to video)
  Resolution: 1920x1080 (Full HD). Change to 3840x2160 for 4K.
  Duration: ~15 seconds at 30fps (450 frames)
=======================================================================
"""

import bpy
import math
import os


# ─────────────────────────────────────────────
#  SETTINGS
# ─────────────────────────────────────────────
RENDER_SAMPLES   = 64       # 64=fast test, 256=good quality, 512=final
RESOLUTION_X     = 1920     # Change to 3840 for 4K
RESOLUTION_Y     = 1080     # Change to 2160 for 4K
FPS              = 30
TOTAL_FRAMES     = 450      # 15 seconds @ 30fps
OUTPUT_PATH      = r"C:\Users\kmrut\OneDrive\Desktop\task cctv\render\frame####"


# ─────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────
def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    # Clear orphan data
    for mesh in bpy.data.meshes:
        bpy.data.meshes.remove(mesh)
    for mat in bpy.data.materials:
        bpy.data.materials.remove(mat)
    for light in bpy.data.lights:
        bpy.data.lights.remove(light)


def new_material(name, base_color=(0.8, 0.8, 0.8, 1), roughness=0.5,
                 metallic=0.0, emission=None, emission_strength=1.0,
                 ior=1.45, alpha=1.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    out = nodes.new("ShaderNodeOutputMaterial")
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value   = base_color
    bsdf.inputs["Roughness"].default_value    = roughness
    bsdf.inputs["Metallic"].default_value     = metallic
    bsdf.inputs["IOR"].default_value          = ior

    if alpha < 1.0:
        bsdf.inputs["Alpha"].default_value = alpha
        mat.blend_method = 'BLEND'

    if emission:
        bsdf.inputs["Emission Color"].default_value    = (*emission, 1)
        bsdf.inputs["Emission Strength"].default_value = emission_strength

    links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat


def add_checker_uv(obj, scale=4.0):
    """Adds a simple checker-board UV texture to an object."""
    mat = bpy.data.materials.new(name=obj.name + "_Checker")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    out   = nodes.new("ShaderNodeOutputMaterial")
    bsdf  = nodes.new("ShaderNodeBsdfPrincipled")
    check = nodes.new("ShaderNodeTexChecker")
    uv    = nodes.new("ShaderNodeTexCoord")
    scale_node = nodes.new("ShaderNodeVectorMath")
    scale_node.operation = 'SCALE'
    scale_node.inputs[3].default_value = scale

    links.new(uv.outputs["UV"],            scale_node.inputs[0])
    links.new(scale_node.outputs["Vector"], check.inputs["Vector"])
    links.new(check.outputs["Color"],       bsdf.inputs["Base Color"])
    links.new(bsdf.outputs["BSDF"],         out.inputs["Surface"])

    bsdf.inputs["Roughness"].default_value = 0.15
    check.inputs["Color1"].default_value = (0.06, 0.06, 0.06, 1)
    check.inputs["Color2"].default_value = (0.12, 0.12, 0.12, 1)

    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)


def set_keyframe(obj, frame, loc=None, rot=None, data_path=None, val=None):
    bpy.context.scene.frame_set(frame)
    if loc is not None:
        obj.location = loc
        obj.keyframe_insert("location", frame=frame)
    if rot is not None:
        obj.rotation_euler = rot
        obj.keyframe_insert("rotation_euler", frame=frame)


def set_light_keyframe(light_data, frame, energy):
    bpy.context.scene.frame_set(frame)
    light_data.energy = energy
    light_data.keyframe_insert("energy", frame=frame)


# ─────────────────────────────────────────────
#  SCENE SETUP
# ─────────────────────────────────────────────
def setup_render():
    scene = bpy.context.scene
    scene.render.engine          = 'CYCLES'
    scene.cycles.samples         = RENDER_SAMPLES
    scene.cycles.use_denoising  = True
    scene.render.resolution_x   = RESOLUTION_X
    scene.render.resolution_y   = RESOLUTION_Y
    scene.render.resolution_percentage = 100
    scene.render.fps             = FPS
    scene.frame_start            = 1
    scene.frame_end              = TOTAL_FRAMES
    scene.render.image_settings.file_format = 'PNG'
    scene.render.filepath        = OUTPUT_PATH

    # World = Pure Black
    scene.world.use_nodes = True
    bg = scene.world.node_tree.nodes.get("Background")
    if bg:
        bg.inputs[0].default_value = (0.0, 0.0, 0.0, 1.0)
        bg.inputs[1].default_value = 0.0


# ─────────────────────────────────────────────
#  CORRIDOR SCENE
# ─────────────────────────────────────────────
def build_corridor():
    """
    Creates a long, narrow indoor corridor with:
    - Polished dark tile floor
    - Painted walls (light beige)
    - Drop ceiling with inset panel lights
    - Baseboard trim
    - End wall with a wooden door
    """
    # ── Floor ──────────────────────────────────
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 7, 0))
    floor = bpy.context.active_object
    floor.name = "Corridor_Floor"
    floor.scale = (3, 14, 1)
    bpy.ops.object.transform_apply(scale=True)
    add_checker_uv(floor, scale=6)

    # ── Ceiling ────────────────────────────────
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 7, 3.2))
    ceiling = bpy.context.active_object
    ceiling.name = "Corridor_Ceiling"
    ceiling.scale = (3, 14, 1)
    ceiling.rotation_euler[0] = math.radians(180)
    bpy.ops.object.transform_apply(scale=True, rotation=True)
    ceiling.data.materials.append(
        new_material("CeilingMat", base_color=(0.9, 0.88, 0.85, 1), roughness=0.9))

    # ── Left Wall ──────────────────────────────
    bpy.ops.mesh.primitive_plane_add(size=1, location=(-3, 7, 1.6))
    lwall = bpy.context.active_object
    lwall.name = "Corridor_LeftWall"
    lwall.scale = (14, 3.2, 1)
    lwall.rotation_euler = (math.radians(90), 0, math.radians(90))
    bpy.ops.object.transform_apply(scale=True, rotation=True)
    lwall.data.materials.append(
        new_material("WallMat_L", base_color=(0.82, 0.78, 0.72, 1), roughness=0.85))

    # ── Right Wall ─────────────────────────────
    bpy.ops.mesh.primitive_plane_add(size=1, location=(3, 7, 1.6))
    rwall = bpy.context.active_object
    rwall.name = "Corridor_RightWall"
    rwall.scale = (14, 3.2, 1)
    rwall.rotation_euler = (math.radians(90), 0, math.radians(-90))
    bpy.ops.object.transform_apply(scale=True, rotation=True)
    rwall.data.materials.append(
        new_material("WallMat_R", base_color=(0.82, 0.78, 0.72, 1), roughness=0.85))

    # ── Back Wall (camera side) ─────────────────
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, -7, 1.6))
    bwall = bpy.context.active_object
    bwall.name = "Corridor_BackWall"
    bwall.scale = (3, 3.2, 1)
    bwall.rotation_euler = (math.radians(90), 0, 0)
    bpy.ops.object.transform_apply(scale=True, rotation=True)
    bwall.data.materials.append(
        new_material("WallMat_Back", base_color=(0.82, 0.78, 0.72, 1), roughness=0.85))

    # ── End Wall with Door ──────────────────────
    # Wall sections around the door frame
    for loc, scl in [
        ((0, 21.02, 2.6), (3, 0.05, 0.7)),     # Top panel above door
        ((-2, 21.02, 1.0), (0.5, 0.05, 2.0)),  # Left of door
        ((2, 21.02, 1.0), (0.5, 0.05, 2.0)),   # Right of door
    ]:
        bpy.ops.mesh.primitive_cube_add(location=loc)
        w = bpy.context.active_object
        w.scale = scl
        w.data.materials.append(
            new_material("EndWallMat", base_color=(0.82, 0.78, 0.72, 1), roughness=0.85))

    # ── Wooden Door ────────────────────────────
    bpy.ops.mesh.primitive_cube_add(location=(0, 21, 1.05))
    door = bpy.context.active_object
    door.name = "Main_Door"
    door.scale = (1.5, 0.07, 1.05)
    door.data.materials.append(
        new_material("DoorMat", base_color=(0.38, 0.22, 0.10, 1), roughness=0.6, metallic=0.0))

    # Door Handle (gold sphere)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.07, location=(1.35, 20.92, 1.0))
    handle = bpy.context.active_object
    handle.name = "Door_Handle"
    handle.data.materials.append(
        new_material("HandleMat", base_color=(0.9, 0.75, 0.3, 1), roughness=0.15, metallic=0.9))

    # ── Baseboard trim (left/right) ────────────
    for x in [-2.9, 2.9]:
        bpy.ops.mesh.primitive_cube_add(location=(x, 7, 0.1))
        trim = bpy.context.active_object
        trim.name = "Baseboard"
        trim.scale = (0.05, 14, 0.1)
        trim.data.materials.append(
            new_material("TrimMat", base_color=(0.95, 0.95, 0.95, 1), roughness=0.5))

    return door, handle


# ─────────────────────────────────────────────
#  CORRIDOR LIGHTING
# ─────────────────────────────────────────────
def build_lighting():
    """Ceiling panel lights down the corridor."""
    panel_lights = []
    for y in [3, 8, 13, 18]:
        # Emissive ceiling panel
        bpy.ops.mesh.primitive_plane_add(size=1, location=(0, y, 3.18))
        panel = bpy.context.active_object
        panel.name = f"LightPanel_{y}"
        panel.scale = (0.5, 1, 1)
        panel.data.materials.append(
            new_material(f"PanelMat_{y}",
                         base_color=(1, 1, 0.9, 1), roughness=0.9,
                         emission=(1, 1, 0.85), emission_strength=5.0))

        # Actual point light below panel
        bpy.ops.object.light_add(type='AREA', location=(0, y, 3.1))
        light = bpy.context.active_object
        light.name = f"CorridorLight_{y}"
        light.data.energy = 400
        light.data.color = (1.0, 0.95, 0.85)
        light.data.size = 0.8
        panel_lights.append(light)

    return panel_lights


# ─────────────────────────────────────────────
#  ALARM LIGHTS
# ─────────────────────────────────────────────
def build_alarm_lights():
    """Red spinning alarm lights mounted on ceiling."""
    alarm_lights = []
    for y, name in [(8, "Alarm_L1"), (12, "Alarm_L2")]:
        # Red dome shape
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.15, location=(0, y, 3.1))
        dome = bpy.context.active_object
        dome.name = name + "_Dome"
        mat = new_material(name + "_Mat",
                           base_color=(1, 0.05, 0.05, 1), roughness=0.2,
                           emission=(1, 0, 0), emission_strength=0.0)
        dome.data.materials.append(mat)

        # Point light below dome
        bpy.ops.object.light_add(type='POINT', location=(0, y, 3.05))
        alight = bpy.context.active_object
        alight.name = name
        alight.data.energy = 0
        alight.data.color = (1, 0, 0)
        alight.data.shadow_soft_size = 0.5
        alarm_lights.append((alight, dome, mat))

    return alarm_lights


# ─────────────────────────────────────────────
#  CCTV CAMERA
# ─────────────────────────────────────────────
def build_cctv():
    """Mounts a CCTV camera on the right wall near the door end."""
    # Wall bracket
    bpy.ops.mesh.primitive_cube_add(location=(2.78, 18, 2.8))
    brack = bpy.context.active_object
    brack.name = "CCTV_Bracket"
    brack.scale = (0.08, 0.2, 0.08)
    brack.data.materials.append(
        new_material("BracketMat", base_color=(0.1, 0.1, 0.1, 1), roughness=0.3, metallic=0.7))

    # Camera housing (cylinder pointing along Y)
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.1, depth=0.35,
        location=(2.5, 18, 2.75))
    housing = bpy.context.active_object
    housing.name = "CCTV_Housing"
    housing.rotation_euler = (math.radians(90), 0, math.radians(-30))  # Aimed toward door
    housing.data.materials.append(
        new_material("HousingMat", base_color=(0.08, 0.08, 0.08, 1), roughness=0.2, metallic=0.8))

    # Lens (dark disc at front)
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.07, depth=0.02,
        location=(2.22, 18.14, 2.62))
    lens = bpy.context.active_object
    lens.name = "CCTV_Lens"
    lens.rotation_euler = (math.radians(90), 0, math.radians(-30))
    lens.data.materials.append(
        new_material("LensMat", base_color=(0.01, 0.01, 0.02, 1), roughness=0.0, metallic=0.95))

    # Red blinking LED
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.025, location=(2.72, 17.85, 2.82))
    led = bpy.context.active_object
    led.name = "CCTV_LED"
    led_mat = new_material("LED_Mat",
                           base_color=(1, 0, 0, 1), roughness=0.1,
                           emission=(1, 0, 0), emission_strength=8.0)
    led.data.materials.append(led_mat)

    # Blink LED (frames 1–250)
    for f in range(1, 251, 24):
        set_light_keyframe_material(led_mat, f, 8.0)
        set_light_keyframe_material(led_mat, f + 12, 0.0)

    return housing, led_mat


def set_light_keyframe_material(mat, frame, strength):
    """Keyframe the emission strength on a material's Principled BSDF."""
    bpy.context.scene.frame_set(frame)
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Emission Strength"].default_value = strength
        bsdf.inputs["Emission Strength"].keyframe_insert(
            data_path="default_value", frame=frame)


# ─────────────────────────────────────────────
#  HUMANOID CHARACTER (Rigged from primitives)
# ─────────────────────────────────────────────
def create_humanoid(name, color, start_location):
    """
    Builds a simple but recognizable humanoid character from mesh
    primitives and groups them under an empty for easy movement.
    Proper animations require a rigged character (e.g., Mixamo FBX),
    but this provides a solid animated stand-in.
    """
    root = bpy.data.objects.new(name + "_Root", None)
    bpy.context.scene.collection.objects.link(root)
    root.location = start_location
    root.empty_display_size = 0.1

    mat = new_material(name + "_Mat",
                       base_color=color, roughness=0.8, metallic=0.0)

    def make_part(pname, primitive, loc, scl, rot=(0, 0, 0), parent=root):
        if primitive == "CUBE":
            bpy.ops.mesh.primitive_cube_add(location=(0, 0, 0))
        elif primitive == "SPHERE":
            bpy.ops.mesh.primitive_uv_sphere_add(radius=0.5, location=(0, 0, 0))
        elif primitive == "CYLINDER":
            bpy.ops.mesh.primitive_cylinder_add(radius=0.5, depth=1, location=(0, 0, 0))
        part = bpy.context.active_object
        part.name = pname
        part.location = loc
        part.scale = scl
        part.rotation_euler = [math.radians(r) for r in rot]
        part.data.materials.append(mat)
        part.parent = parent
        return part

    head      = make_part(name+"_Head",  "SPHERE", (0, 0, 1.75),  (0.22, 0.22, 0.24))
    torso     = make_part(name+"_Torso", "CUBE",   (0, 0, 1.25),  (0.22, 0.14, 0.30))
    larm      = make_part(name+"_LArmU", "CUBE",   (-0.30, 0, 1.25), (0.09, 0.09, 0.28))
    rarm      = make_part(name+"_RArmU", "CUBE",   ( 0.30, 0, 1.25), (0.09, 0.09, 0.28))
    lleg      = make_part(name+"_LLegU", "CUBE",   (-0.12, 0, 0.68), (0.1, 0.1, 0.32))
    rleg      = make_part(name+"_RLegU", "CUBE",   ( 0.12, 0, 0.68), (0.1, 0.1, 0.32))
    lfoot     = make_part(name+"_LFoot", "CUBE",   (-0.12, 0.06, 0.1), (0.08, 0.15, 0.06))
    rfoot     = make_part(name+"_RFoot", "CUBE",   ( 0.12, 0.06, 0.1), (0.08, 0.15, 0.06))

    return root, lleg, rleg, larm, rarm


# ─────────────────────────────────────────────
#  ANIMATE THIEF
# ─────────────────────────────────────────────
def animate_thief(thief_root, lleg, rleg, larm, rarm):
    """
    Running cycle: alternating leg/arm swings while the root moves.
    Timeline:
      1–120    → Thief runs from back of corridor toward door
      120–180  → Thief tries door handle (jiggle)
      180–240  → Alarm fires; thief startles, turns
      240–420  → Thief sprints back toward camera and exits
    """
    # ── Run toward door ─────────────────────────
    set_keyframe(thief_root, 1,   loc=(0, -6, 0))
    set_keyframe(thief_root, 120, loc=(0, 18, 0))

    # Leg swing while running (6-frame cycle over 120 frames)
    for f in range(1, 121, 6):
        # Forward phase
        bpy.context.scene.frame_set(f)
        lleg.rotation_euler = (math.radians(30), 0, 0)
        lleg.keyframe_insert("rotation_euler", frame=f)
        rleg.rotation_euler = (math.radians(-30), 0, 0)
        rleg.keyframe_insert("rotation_euler", frame=f)
        larm.rotation_euler = (math.radians(-30), 0, 0)
        larm.keyframe_insert("rotation_euler", frame=f)
        rarm.rotation_euler = (math.radians(30), 0, 0)
        rarm.keyframe_insert("rotation_euler", frame=f)

        # Backward phase (3 frames later)
        bpy.context.scene.frame_set(f + 3)
        lleg.rotation_euler = (math.radians(-30), 0, 0)
        lleg.keyframe_insert("rotation_euler", frame=f + 3)
        rleg.rotation_euler = (math.radians(30), 0, 0)
        rleg.keyframe_insert("rotation_euler", frame=f + 3)
        larm.rotation_euler = (math.radians(30), 0, 0)
        larm.keyframe_insert("rotation_euler", frame=f + 3)
        rarm.rotation_euler = (math.radians(-30), 0, 0)
        rarm.keyframe_insert("rotation_euler", frame=f + 3)

    # ── Trying door handle (stationary + lean) ───
    for f in range(120, 180, 12):
        set_keyframe(thief_root, f, rot=(0, math.radians(-5), 0))      # lean forward
        set_keyframe(thief_root, f + 6, rot=(0, math.radians(5), 0))   # lean back

    # ── Startled! Turns around ───────────────────
    set_keyframe(thief_root, 200, rot=(0, 0, 0))
    set_keyframe(thief_root, 215, rot=(0, 0, math.radians(180)))  # Turn 180°

    # ── Sprint back (away from door) ────────────
    set_keyframe(thief_root, 215, loc=(0, 18, 0))
    set_keyframe(thief_root, 400, loc=(0, -10, 0))   # Exits toward camera

    # Running cycle for sprint back
    for f in range(215, 400, 6):
        bpy.context.scene.frame_set(f)
        lleg.rotation_euler = (math.radians(35), 0, 0)
        lleg.keyframe_insert("rotation_euler", frame=f)
        rleg.rotation_euler = (math.radians(-35), 0, 0)
        rleg.keyframe_insert("rotation_euler", frame=f)
        bpy.context.scene.frame_set(f + 3)
        lleg.rotation_euler = (math.radians(-35), 0, 0)
        lleg.keyframe_insert("rotation_euler", frame=f + 3)
        rleg.rotation_euler = (math.radians(35), 0, 0)
        rleg.keyframe_insert("rotation_euler", frame=f + 3)


# ─────────────────────────────────────────────
#  ANIMATE POLICE
# ─────────────────────────────────────────────
def animate_police(police_root, p_lleg, p_rleg, p_larm, p_rarm):
    """
    Police arrive from the camera side after alarm fires.
    Timeline:
      200–350  → Police enter from back, run toward door
    """
    # Start off-screen, facing toward door
    set_keyframe(police_root, 200,  loc=(-4, -8, 0),  rot=(0, 0, 0))
    set_keyframe(police_root, 350,  loc=(-0.5, 16, 0))

    # Running cycle
    for f in range(200, 350, 6):
        bpy.context.scene.frame_set(f)
        p_lleg.rotation_euler = (math.radians(28), 0, 0)
        p_lleg.keyframe_insert("rotation_euler", frame=f)
        p_rleg.rotation_euler = (math.radians(-28), 0, 0)
        p_rleg.keyframe_insert("rotation_euler", frame=f)
        p_larm.rotation_euler = (math.radians(-28), 0, 0)
        p_larm.keyframe_insert("rotation_euler", frame=f)
        p_rarm.rotation_euler = (math.radians(28), 0, 0)
        p_rarm.keyframe_insert("rotation_euler", frame=f)
        bpy.context.scene.frame_set(f + 3)
        p_lleg.rotation_euler = (math.radians(-28), 0, 0)
        p_lleg.keyframe_insert("rotation_euler", frame=f + 3)
        p_rleg.rotation_euler = (math.radians(28), 0, 0)
        p_rleg.keyframe_insert("rotation_euler", frame=f + 3)


# ─────────────────────────────────────────────
#  ANIMATE CCTV
# ─────────────────────────────────────────────
def animate_cctv(housing):
    """
    CCTV pans, detects thief, tracks, then alarm fires.
    Timeline:
      1–80   → Idle pan (slow left-right)
      150    → Snap to look at thief at door
      155+   → Alarm LED turns red/flashing
    """
    # Idle pan
    set_keyframe(housing, 1,   rot=(math.radians(90), 0, math.radians(-20)))
    set_keyframe(housing, 80,  rot=(math.radians(90), 0, math.radians( 20)))
    set_keyframe(housing, 160, rot=(math.radians(90), 0, math.radians(-20)))

    # Snap to thief at door (frame 140–155)
    set_keyframe(housing, 138, rot=(math.radians(90), 0, math.radians(-20)))
    set_keyframe(housing, 152, rot=(math.radians(110), 0, math.radians(-40)))  # Tilt down + left

    # Hold tracking
    set_keyframe(housing, 290, rot=(math.radians(110), 0, math.radians(-40)))


# ─────────────────────────────────────────────
#  ANIMATE ALARM LIGHTS
# ─────────────────────────────────────────────
def animate_alarms(alarm_lights):
    """Flash red lights from frame 155 to 450."""
    for alight, dome, dome_mat in alarm_lights:
        # Off before alarm
        set_light_keyframe(alight.data, 1, 0)
        set_light_keyframe(alight.data, 154, 0)

        # Flash cycle (155 onwards)
        for f in range(155, TOTAL_FRAMES, 8):
            set_light_keyframe(alight.data, f,     1500)
            set_light_keyframe(alight.data, f + 4, 0)

        # Dome glow matches
        set_light_keyframe_material(dome_mat, 1, 0.0)
        set_light_keyframe_material(dome_mat, 154, 0.0)
        for f in range(155, TOTAL_FRAMES, 8):
            set_light_keyframe_material(dome_mat, f,     20.0)
            set_light_keyframe_material(dome_mat, f + 4, 0.0)


# ─────────────────────────────────────────────
#  RENDER CAMERA
# ─────────────────────────────────────────────
def setup_camera():
    """
    Wall-mounted CCTV camera viewpoint.
    Looking down the corridor from the far end, tilted down.
    """
    bpy.ops.object.camera_add(location=(2.6, 21.5, 2.9))
    cam = bpy.context.active_object
    cam.name = "Main_Camera"
    bpy.context.scene.camera = cam
    cam.rotation_euler = (math.radians(110), 0, math.radians(-155))
    cam.data.lens = 16   # Wide angle for corridor feel

    # Subtle slow push-in during thief approach
    set_keyframe(cam, 1,   loc=(2.6, 21.5, 2.9))
    set_keyframe(cam, 120, loc=(2.3, 21.2, 2.8))

    # Zoom in slightly when alarm fires
    bpy.context.scene.frame_set(155)
    cam.data.lens = 16
    cam.data.keyframe_insert("lens", frame=155)
    bpy.context.scene.frame_set(175)
    cam.data.lens = 22
    cam.data.keyframe_insert("lens", frame=175)

    return cam


# ─────────────────────────────────────────────
#  MAIN
# ─────────────────────────────────────────────
def main():
    print("=" * 60)
    print("  CCTV Security Scene – Building...")
    print("=" * 60)

    clear_scene()
    setup_render()

    print("  [1/7] Corridor...")
    door, handle = build_corridor()

    print("  [2/7] Lighting...")
    build_lighting()
    alarm_lights = build_alarm_lights()

    print("  [3/7] CCTV Camera...")
    housing, led_mat = build_cctv()

    print("  [4/7] Thief character...")
    thief_root, t_ll, t_rl, t_la, t_ra = create_humanoid(
        "Thief",
        color=(0.02, 0.02, 0.02, 1),   # Dark
        start_location=(0, -6, 0))

    print("  [5/7] Police officer...")
    police_root, p_ll, p_rl, p_la, p_ra = create_humanoid(
        "Police",
        color=(0.1, 0.2, 0.6, 1),       # Navy blue uniform
        start_location=(-4, -8, 0))
    # Police are hidden until frame 200
    bpy.context.scene.frame_set(1)
    police_root.hide_render = True
    police_root.hide_viewport = True
    police_root.keyframe_insert("hide_render", frame=1)
    police_root.keyframe_insert("hide_viewport", frame=1)
    bpy.context.scene.frame_set(200)
    police_root.hide_render = False
    police_root.hide_viewport = False
    police_root.keyframe_insert("hide_render", frame=200)
    police_root.keyframe_insert("hide_viewport", frame=200)

    print("  [6/7] Animating...")
    animate_thief(thief_root, t_ll, t_rl, t_la, t_ra)
    animate_police(police_root, p_ll, p_rl, p_la, p_ra)
    animate_cctv(housing)
    animate_alarms(alarm_lights)

    print("  [7/7] Camera setup...")
    setup_camera()

    print()
    print("=" * 60)
    print("  ✅  Scene built successfully!")
    print(f"  Frames: 1 – {TOTAL_FRAMES}  ({TOTAL_FRAMES // FPS}s at {FPS}fps)")
    print(f"  Resolution: {RESOLUTION_X} × {RESOLUTION_Y}")
    print(f"  Samples: {RENDER_SAMPLES}")
    print()
    
    # Save the .blend file automatically
    blend_path = r"C:\Users\kmrut\OneDrive\Desktop\task cctv\cctv_scene.blend"
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    print(f"  Saved to: {blend_path}")
    print("=" * 60)


main()
