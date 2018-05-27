#version 150  

in vec3 aPosition;
in vec3 aNormal;
in vec2 aTexCoord;

uniform mat4 uModelViewProjMatrix;
uniform mat4 uModelViewMatrix;
uniform mat3 uNormalMatrix;
uniform mat4 uShadowMatrix;

uniform int uDrawingShadowMap;

out vec3 vECPos; // S.R. Vista
out vec3 vECNorm; // S.R. Vista
out vec4 vShadowTextCoord;

void main()
{
	if ( uDrawingShadowMap == 0 ) 
	{
		vECPos = vec3(uModelViewMatrix * vec4(aPosition, 1.0));
		vECNorm = normalize(uNormalMatrix * aNormal);

		// Tarea por hacer: Calcular las coordenadas de textura del mapa de profudidad
		vShadowTextCoord = uShadowMatrix * vec4(aPosition,1.0);
	}

	gl_Position = uModelViewProjMatrix * vec4(aPosition, 1.0);
}