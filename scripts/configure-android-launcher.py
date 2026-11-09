#!/usr/bin/env python3
"""Ensure RVS ERP is a visible Android launcher app and request a home shortcut."""
from pathlib import Path
import xml.etree.ElementTree as ET

ANDROID = "http://schemas.android.com/apk/res/android"
ET.register_namespace("android", ANDROID)
manifest = Path("android/app/src/main/AndroidManifest.xml")
if not manifest.exists():
    raise SystemExit("AndroidManifest.xml is missing")
tree = ET.parse(manifest)
root = tree.getroot()
app = root.find("application")
if app is None:
    raise SystemExit("Android application element is missing")
app.set("{" + ANDROID + "}label", "RVS ERP")
activity = next((node for node in app.findall("activity")
                 if node.get("{" + ANDROID + "}name", "").endswith("MainActivity")), None)
if activity is None:
    raise SystemExit("Capacitor MainActivity is missing")
activity.set("{" + ANDROID + "}exported", "true")
filters = activity.findall("intent-filter")
is_launcher = any(
    any(x.get("{" + ANDROID + "}name") == "android.intent.action.MAIN" for x in f.findall("action"))
    and any(x.get("{" + ANDROID + "}name") == "android.intent.category.LAUNCHER" for x in f.findall("category"))
    for f in filters
)
if not is_launcher:
    raise SystemExit("MainActivity has no MAIN/LAUNCHER intent filter")
tree.write(manifest, encoding="utf-8", xml_declaration=True)

java_dir = Path("android/app/src/main/java/com/railverse/signallingworks")
java_dir.mkdir(parents=True, exist_ok=True)
(java_dir / "MainActivity.java").write_text("""package com.railverse.signallingworks;

import android.content.pm.ShortcutInfo;
import android.content.Intent;
import android.content.pm.ShortcutManager;
import android.graphics.drawable.Icon;
import android.os.Build;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestRvsHomeShortcut();
    }

    private void requestRvsHomeShortcut() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        ShortcutManager manager = getSystemService(ShortcutManager.class);
        if (manager == null || !manager.isRequestPinShortcutSupported()) return;
        for (ShortcutInfo item : manager.getPinnedShortcuts()) {
            if ("rvs-erp-home".equals(item.getId())) return;
        }
        if (getPreferences(MODE_PRIVATE).getBoolean("rvs_home_shortcut_requested", false)) return;
        Intent launch = new Intent(this, MainActivity.class);
        launch.setAction(Intent.ACTION_MAIN);
        launch.addCategory(Intent.CATEGORY_LAUNCHER);
        ShortcutInfo shortcut = new ShortcutInfo.Builder(this, "rvs-erp-home")
            .setShortLabel("RVS ERP")
            .setLongLabel("Rail verse signalling works")
            .setIcon(Icon.createWithResource(this, com.railverse.signallingworks.R.mipmap.ic_launcher))
            .setIntent(launch)
            .build();
        getPreferences(MODE_PRIVATE).edit().putBoolean("rvs_home_shortcut_requested", true).apply();
        manager.requestPinShortcut(shortcut, null);
    }
}
""", encoding="utf-8")
print("RVS launcher activity verified; Android will request user approval to pin RVS ERP to Home.")
