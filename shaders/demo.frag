#version 150 

in vec3 vECPos; // S.R. Vista
in vec3 vECNorm; // S.R. Vista
in vec4 vShadowTextCoord;

out vec4 fFragColor;

uniform int uDrawingShadowMap;
uniform sampler2DShadow uShadowMap;
uniform int uPCF;

struct LightInfo {
	vec4 lightPos; // Posición de la luz (S.R. de la vista)
	vec3 intensity;
};
uniform LightInfo uLight;
struct MaterialInfo {
	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
	float shininess;
};
uniform MaterialInfo uMaterial;


vec3 phongModelDiffAndSpec () 
{
	vec3 ldir = normalize(vec3(uLight.lightPos) - vECPos);
	vec3 view = normalize(vec3(-vECPos));
	vec3 r = reflect(-ldir,vECNorm);

	vec3 color = uLight.intensity * ( uMaterial.diffuse * max(dot(ldir,vECNorm), 0.0) +
									  uMaterial.specular * pow(max(dot(r,view),0),uMaterial.shininess) );

	return clamp(color, 0.0, 1.0);
}


void main()
{
	if ( uDrawingShadowMap == 0 )
	{
		vec3 ambient = uLight.intensity * uMaterial.ambient;
		vec3 diffAndSpec = phongModelDiffAndSpec();

		// Tarea por hacer: consultar el mapa de profundidad para calcular el factor de ocultación (shadow)
		float shadow = 0;
		switch(uPCF)
		{
                    case 0:
                        shadow += textureProj(uShadowMap, vShadowTextCoord);
                        break;
               
                    case 1:
                        shadow += textureProjOffset(uShadowMap, vShadowTextCoord, ivec2(-1,-1));
                        shadow += textureProjOffset(uShadowMap, vShadowTextCoord, ivec2(1,-1));
                        shadow += textureProjOffset(uShadowMap, vShadowTextCoord, ivec2(-1,1));
                        shadow += textureProjOffset(uShadowMap, vShadowTextCoord, ivec2(1,1));
                        shadow *= 0.25;
                        break;
                        
                    case 2:
                        int count = 0;
                        for(int i=-3; i<=3; i++)
                        {
                            for(int j=-3; j<=3; j++)
                            {
                                shadow += textureProjOffset(uShadowMap, vShadowTextCoord, ivec2(i, j));
                                count++;
                            }
                        }
                        shadow /= count;
                        break;
                }

		fFragColor = vec4( clamp(ambient + shadow * diffAndSpec, 0.0, 1.0), 1.0 );
	}
}